import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import prisma from './prisma';
import { authenticate } from '../middleware/auth';
import { processTransaction } from './wallet';

// Extend Express request type to include user
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

const router = express.Router();

// IMPORTANT: Route order matters in Express! 
// More specific routes must come before generic ones with params

// Get all challenges 
router.get('/', async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany();
    
    res.json({
      success: true,
      count: challenges.length,
      data: challenges,
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get user's active challenges
 * GET /api/challenges/user/active
 * Protected route that requires authentication
 */
router.get('/user/active', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    
    // Get user's active challenges
    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        challenge: true
      },
      orderBy: {
        joinedAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      count: userChallenges.length,
      data: userChallenges,
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user challenges',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await prisma.challenge.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }
    
    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Join a challenge
 * POST /api/challenges/:id/join
 * Protected route that requires authentication
 */
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    const challengeId = parseInt(req.params.id);
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    
    // Check if challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    
    if (!challenge) {
      res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
      return;
    }
    
    // Check if user already joined this challenge
    const existingUserChallenge = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        }
      }
    });
    
    if (existingUserChallenge) {
      res.status(400).json({
        success: false,
        message: 'You have already joined this challenge',
      });
      return;
    }
    
    // Process the transaction (deduct stake from wallet)
    try {
      const transactionResult = await processTransaction(
        userId,
        -challenge.userStake, // Negative amount for deduction
        'CHALLENGE_JOIN',
        `Joined challenge: ${challenge.title}`,
        challengeId
      );
      
      // Create user challenge record
      const userChallenge = await prisma.userChallenge.create({
        data: {
          userId,
          challengeId,
          stakeAmount: challenge.userStake,
          status: 'ACTIVE'
        }
      });
      
      // Update challenge participant count
      await prisma.challenge.update({
        where: { id: challengeId },
        data: {
          participantCount: challenge.participantCount + 1
        }
      });
      
      res.status(200).json({
        success: true,
        message: `Successfully joined challenge: ${challenge.title}`,
        data: {
          userChallenge,
          newWalletBalance: transactionResult.newBalance
        }
      });
    } catch (error) {
      // Handle specific errors
      if (error instanceof Error && error.message === 'Insufficient wallet balance') {
        res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance to join this challenge',
        });
        return;
      }
      
      throw error; // Re-throw for general error handling
    }
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while joining the challenge',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;  