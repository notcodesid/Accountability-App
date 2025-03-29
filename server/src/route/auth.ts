import express, { Request, Response } from 'express';
import { z } from 'zod'; // For input validation
import prisma from './prisma';
import { hashPassword, comparePassword } from '../lib/password';
import { generateToken, verifyToken } from '../lib/jwt';

const router = express.Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signinSchema = z.object({
  // Allow signing in with either email or username
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Sign up a new user
 * POST /api/auth/signup
 */
const signupHandler = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = signupSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.errors,
      });
      return;
    }
    
    const { email, username, password } = validationResult.data;
    
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingEmail) {
      res.status(400).json({
        success: false,
        message: 'Email already in use',
      });
      return;
    }
    
    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUsername) {
      res.status(400).json({
        success: false,
        message: 'Username already taken',
      });
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    // Return user info and token (exclude password)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during signup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Sign in an existing user
 * POST /api/auth/signin
 */
const signinHandler = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = signinSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationResult.error.errors,
      });
      return;
    }
    
    const { emailOrUsername, password } = validationResult.data;
    
    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }
    
    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    // Return user info and token (exclude password)
    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during signin',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get current user information
 * GET /api/auth/me (protected route)
 * This will be used by the frontend to verify token validity and get current user data
 */
const getMeHandler = async (req: Request, res: Response) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
      return;
    }
    
    // Extract token
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        wallet: true,
        createdAt: true,
        updatedAt: true,
        leaderboardEntry: true,
      },
    });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Check if user has a leaderboard entry, create one if it doesn't exist
    if (!user.leaderboardEntry) {
      // Get the last rank to put the user at the end
      const lastRank = await prisma.leaderboardUser.findFirst({
        orderBy: {
          rank: 'desc',
        },
        select: {
          rank: true,
        },
      });
      
      const newRank = lastRank ? lastRank.rank + 1 : 1;
      
      await prisma.leaderboardUser.create({
        data: {
          userId: user.id,
          name: user.username,
          points: 500, // Default starting points
          avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Default avatar
          rank: newRank,
        },
      });
      
      console.log(`Created leaderboard entry for user ${user.username}`);
    }
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while getting user information',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Register the route handlers
router.post('/signup', signupHandler);
router.post('/signin', signinHandler);
router.get('/me', getMeHandler);

export default router; 