"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod"); // For input validation
const prisma_1 = __importDefault(require("./prisma"));
const password_1 = require("../lib/password");
const jwt_1 = require("../lib/jwt");
const router = express_1.default.Router();
// Validation schemas
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
const signinSchema = zod_1.z.object({
    // Allow signing in with either email or username
    emailOrUsername: zod_1.z.string().min(1, 'Email or username is required'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
/**
 * Sign up a new user
 * POST /api/auth/signup
 */
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingEmail = yield prisma_1.default.user.findUnique({
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
        const existingUsername = yield prisma_1.default.user.findUnique({
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
        const hashedPassword = yield (0, password_1.hashPassword)(password);
        // Create user
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
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
    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during signup',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
/**
 * Sign in an existing user
 * POST /api/auth/signin
 */
const signinHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield prisma_1.default.user.findFirst({
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
        const isPasswordValid = yield (0, password_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
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
    }
    catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during signin',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
/**
 * Get current user information
 * GET /api/auth/me (protected route)
 * This will be used by the frontend to verify token validity and get current user data
 */
const getMeHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
            return;
        }
        // Find user
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                username: true,
                wallet: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while getting user information',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// Register the route handlers
router.post('/signup', signupHandler);
router.post('/signin', signinHandler);
router.get('/me', getMeHandler);
exports.default = router;
