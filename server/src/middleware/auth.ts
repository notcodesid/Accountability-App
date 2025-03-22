import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, RequestHandler } from '../types/index.js';
import { auth } from '../config/firebase.js';

const prisma = new PrismaClient();

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    // Get Firebase ID token from header
    const idToken = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!idToken) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Get the user's email from the Firebase token
    const email = decodedToken.email;
    
    if (!email) {
      return res.status(401).json({ error: 'Email not found in token' });
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

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user to request
    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
}; 