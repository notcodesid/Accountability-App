import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';
import prisma from '../route/prisma';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT tokens
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    // Extract token from header
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
      return;
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }
    
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Attach user to request object
    req.user = user;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
    return;
  }
}; 