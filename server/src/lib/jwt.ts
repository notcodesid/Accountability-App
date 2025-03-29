import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get JWT secret from environment variables or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-key';

// Token expiration time
const TOKEN_EXPIRATION = '7d'; // Tokens valid for 7 days

interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token for a user
 * @param payload User data to include in the token
 * @returns JWT token string
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });
};

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from authorization header
 * @param authHeader Authorization header value
 * @returns Token string or null if not found/invalid
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Remove 'Bearer ' prefix to get the token
  return authHeader.substring(7);
}; 