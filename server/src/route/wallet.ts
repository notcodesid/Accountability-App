import express, { Request, Response } from 'express';
import prisma from './prisma';
import { verifyToken } from '../lib/jwt';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * Get user wallet information
 * GET /api/wallet
 * Protected route that requires authentication
 */
const getWalletHandler = async (req: Request, res: Response) => {
  try {
    // The authenticate middleware will already have verified the token
    // and added the user to the request object
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    
    // Get user wallet information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        wallet: true,
      },
    });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Return just the wallet balance value from the database
    res.status(200).json({
      success: true,
      data: {
        balance: user.wallet
      },
    });
  } catch (error) {
    console.error('Error getting wallet information:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while getting wallet information',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Register routes
router.get('/', authenticate, getWalletHandler);

export default router; 