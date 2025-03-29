import express from 'express';
import prisma from './prisma';

const router = express.Router();

/**
 * Get leaderboard data
 * GET /api/leaderboard
 */
router.get('/', async (req, res) => {
  try {
    // Fetch leaderboard entries sorted by rank
    const leaderboard = await prisma.leaderboardUser.findMany({
      orderBy: {
        rank: 'asc'
      }
    });
    
    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get user ranking in leaderboard
 * GET /api/leaderboard/user/:userId
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's leaderboard entry
    const leaderboardEntry = await prisma.leaderboardUser.findUnique({
      where: { userId }
    });
    
    if (!leaderboardEntry) {
      return res.status(404).json({
        success: false,
        message: 'User not found in leaderboard',
      });
    }
    
    // Get entry count for users with more points (to calculate actual rank)
    const higherRankedCount = await prisma.leaderboardUser.count({
      where: {
        points: {
          gt: leaderboardEntry.points
        }
      }
    });
    
    // Add 1 to get the actual rank (1-indexed)
    const actualRank = higherRankedCount + 1;
    
    res.json({
      success: true,
      data: {
        ...leaderboardEntry,
        actualRank
      }
    });
  } catch (error) {
    console.error('Error fetching user leaderboard position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user leaderboard position',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 