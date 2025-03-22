import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecret';
export const authenticate = async (req, res, next) => {
    try {
        // Get JWT token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }
        // Verify JWT token
        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Find user by ID
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Add user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};
