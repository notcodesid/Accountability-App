import express from 'express';
import prisma from '../lib/prisma';

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


// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await prisma.challenge.findUnique({
      where: { id },
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


export default router;  