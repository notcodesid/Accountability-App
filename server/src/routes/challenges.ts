import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { AuthRequest, CreateChallengeInput, GoalType, RequestHandler } from '../types/index.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new challenge
const createChallenge: RequestHandler = async (req, res) => {
  const { title, description, startDate, endDate, goalType, goalTarget, entryFee, isPublic } = req.body as CreateChallengeInput;
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!title || !description || !startDate || !endDate || !goalType || !goalTarget || entryFee === undefined) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        goalType: goalType as GoalType,
        goalTarget,
        entryFee,
        isPublic: isPublic ?? true,
        creatorId: authReq.user.id
      }
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all challenges (public or user's own)
const getAllChallenges: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        OR: [
          { isPublic: true },
          { creatorId: authReq.user.id }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        _count: {
          select: { participants: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single challenge by ID
const getChallengeById: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            },
            progress: true
          }
        }
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if user can access this challenge
    if (!challenge.isPublic && challenge.creatorId !== authReq.user.id) {
      return res.status(403).json({ error: 'You do not have permission to view this challenge' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Join a challenge
const joinChallenge: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id },
      include: {
        participants: {
          where: { userId: authReq.user.id }
        }
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if the challenge has already started
    if (new Date(challenge.startDate) < new Date()) {
      return res.status(400).json({ error: 'Cannot join a challenge that has already started' });
    }

    // Check if user is already participating
    if (challenge.participants.length > 0) {
      return res.status(400).json({ error: 'You are already participating in this challenge' });
    }

    // Create participation record
    const participation = await prisma.participation.create({
      data: {
        userId: authReq.user.id,
        challengeId: challenge.id,
        hasPaid: false // User needs to pay the entry fee
      }
    });

    res.status(201).json(participation);
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Record progress for a challenge
const recordProgress: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { date, value, source } = req.body;
  
  if (!date || value === undefined || !source) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Check if user is participating in this challenge
    const participation = await prisma.participation.findFirst({
      where: { 
        challengeId: req.params.id,
        userId: authReq.user.id
      }
    });

    if (!participation) {
      return res.status(404).json({ error: 'You are not participating in this challenge' });
    }

    // Check if user has paid the entry fee
    if (!participation.hasPaid) {
      return res.status(400).json({ error: 'You need to pay the entry fee before recording progress' });
    }

    // Check if the date is within the challenge period
    const challenge = await prisma.challenge.findUnique({
      where: { id: req.params.id }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const progressDate = new Date(date);
    if (progressDate < challenge.startDate || progressDate > challenge.endDate) {
      return res.status(400).json({ error: 'Date is outside the challenge period' });
    }

    // Create or update progress record
    const progress = await prisma.progressRecord.upsert({
      where: {
        participationId_date: {
          participationId: participation.id,
          date: progressDate
        }
      },
      update: {
        value,
        source
      },
      create: {
        participationId: participation.id,
        date: progressDate,
        value,
        source
      }
    });

    res.json(progress);
  } catch (error) {
    console.error('Record progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's challenges (participating in)
const getUserChallenges: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const participations = await prisma.participation.findMany({
      where: { userId: authReq.user.id },
      include: {
        challenge: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            },
            _count: {
              select: { participants: true }
            }
          }
        },
        progress: true
      }
    });

    res.json(participations);
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark payment as completed (Simulated - will be replaced with Solana integration)
const markPayment: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const participation = await prisma.participation.findFirst({
      where: { 
        challengeId: req.params.id,
        userId: authReq.user.id
      }
    });

    if (!participation) {
      return res.status(404).json({ error: 'You are not participating in this challenge' });
    }

    if (participation.hasPaid) {
      return res.status(400).json({ error: 'You have already paid for this challenge' });
    }

    // Update payment status
    const updatedParticipation = await prisma.participation.update({
      where: { id: participation.id },
      data: { hasPaid: true }
    });

    res.json(updatedParticipation);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Register routes
router.post('/', authenticate, createChallenge);
router.get('/', authenticate, getAllChallenges);
router.get('/user/participating', authenticate, getUserChallenges);
router.get('/:id', authenticate, getChallengeById);
router.post('/:id/join', authenticate, joinChallenge);
router.post('/:id/progress', authenticate, recordProgress);
router.post('/:id/payment', authenticate, markPayment);

export default router; 