import express from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from '../types/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';
// In production, use a real email service
// import nodemailer from 'nodemailer';

const router = express.Router();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecret';

// Store verification tokens (in production use Redis or database)
const verificationTokens = new Map<string, { email: string, token: string, expires: Date }>();

// Signup with email verification
const signup: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with emailVerified set to false
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword,
        emailVerified: false
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // Expires in 24 hours
    
    // Store token (in production, save to database)
    verificationTokens.set(email, {
      email,
      token: verificationToken,
      expires: expiryDate
    });
    
    // In production, send email with verification link
    // For now, log token to console for testing
    console.log(`Verification token for ${email}: ${verificationToken}`);
    
    // Create a sanitized user object without the password
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      profilePic: user.profilePic,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt
    };
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login
const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a sanitized user object without the password
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      profilePic: user.profilePic,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt
    };

    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Verify email
const verifyEmail: RequestHandler = async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }
  
  try {
    // Find the email associated with this token
    let userEmail = '';
    let found = false;
    
    for (const [email, data] of verificationTokens.entries()) {
      if (data.token === token) {
        if (new Date() > data.expires) {
          return res.status(400).json({ error: 'Verification token has expired' });
        }
        userEmail = email;
        found = true;
        break;
      }
    }
    
    if (!found) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }
    
    // Update user's emailVerified status
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: { emailVerified: true }
    });
    
    // Remove token from storage
    verificationTokens.delete(userEmail);
    
    // Return success
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Resend verification email
const resendVerification: RequestHandler = async (req, res) => {
  try {
    // Get user from auth middleware
    const authReq = req as any;
    
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // Expires in 24 hours
    
    // Store token
    verificationTokens.set(user.email, {
      email: user.email,
      token: verificationToken,
      expires: expiryDate
    });
    
    // In production, send email with verification link
    // For now, log token to console for testing
    console.log(`Verification token for ${user.email}: ${verificationToken}`);
    
    res.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user
const getMe: RequestHandler = async (req, res) => {
  const authReq = req as any;
  
  if (!authReq.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create a sanitized user object without the password
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      profilePic: user.profilePic,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt
    };
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', authenticate, resendVerification);
router.get('/me', authenticate, getMe);

export default router; 