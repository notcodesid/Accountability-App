import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../config/firebase.js';
const router = express.Router();
const prisma = new PrismaClient();
// Verify and create/update user with Firebase token
const authenticateWithFirebase = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ error: 'Please provide Firebase ID token' });
    }
    try {
        // Verify Firebase token
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        if (!email) {
            return res.status(400).json({ error: 'Email not found in token' });
        }
        // Find or create user by Firebase UID
        let user = await prisma.user.findUnique({
            where: { firebaseUid: uid }
        });
        // If no user with this Firebase UID exists, try to find by email
        if (!user && email) {
            user = await prisma.user.findUnique({
                where: { email }
            });
            // If found by email, update with Firebase UID
            if (user) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { firebaseUid: uid }
                });
            }
        }
        // If still no user, create a new one
        if (!user && email) {
            const name = decodedToken.name || email.split('@')[0];
            const picture = decodedToken.picture;
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    firebaseUid: uid,
                    profilePic: picture
                }
            });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Firebase authentication error:', error);
        res.status(401).json({ error: 'Invalid Firebase token' });
    }
};
// Get current user from Firebase token
const getCurrentUser = async (req, res) => {
    const idToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!idToken) {
        return res.status(401).json({ error: 'No authentication token' });
    }
    try {
        // Verify Firebase token
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const user = await prisma.user.findUnique({
            where: { firebaseUid: uid }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
router.post('/firebase', authenticateWithFirebase);
router.get('/me', getCurrentUser);
export default router;
