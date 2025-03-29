import express, { Request, Response } from 'express';
import prisma from './prisma';
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

/**
 * Process a transaction and update wallet balance
 * This is an internal utility function, not exposed as an API endpoint
 */
export const processTransaction = async (
  userId: string,
  amount: number,
  type: 'CHALLENGE_JOIN' | 'CHALLENGE_REWARD' | 'SYSTEM_BONUS' | 'REFERRAL_BONUS',
  description: string,
  relatedChallengeId?: number
) => {
  // Start a transaction to ensure both operations complete or fail together
  return await prisma.$transaction(async (tx) => {
    // 1. Get current wallet balance
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { wallet: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 2. Check if user has enough balance for debits (negative amounts)
    if (amount < 0 && user.wallet + amount < 0) {
      throw new Error('Insufficient wallet balance');
    }

    // 3. Update wallet balance
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { wallet: user.wallet + amount },
    });

    // 4. Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        relatedChallengeId,
      },
    });

    return {
      newBalance: updatedUser.wallet,
      transaction,
    };
  });
};

/**
 * Get transaction history for the user
 * GET /api/wallet/transactions
 * Protected route that requires authentication
 */
const getTransactionsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    
    // Get the user's transaction history
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while getting transaction history',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Register routes
router.get('/', authenticate, getWalletHandler);
router.get('/transactions', authenticate, getTransactionsHandler);

export default router; 