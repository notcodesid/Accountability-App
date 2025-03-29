"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Get JWT secret from environment variables or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-key';
// Token expiration time
const TOKEN_EXPIRATION = '7d'; // Tokens valid for 7 days
/**
 * Generate a JWT token for a user
 * @param payload User data to include in the token
 * @returns JWT token string
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
    });
};
exports.generateToken = generateToken;
/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Extract token from authorization header
 * @param authHeader Authorization header value
 * @returns Token string or null if not found/invalid
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    // Remove 'Bearer ' prefix to get the token
    return authHeader.substring(7);
};
exports.extractTokenFromHeader = extractTokenFromHeader;
