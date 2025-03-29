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
const prisma_1 = __importDefault(require("./prisma"));
const auth_1 = require("../middleware/auth");
const wallet_1 = require("./wallet");
const router = express_1.default.Router();
// IMPORTANT: Route order matters in Express! 
// More specific routes must come before generic ones with params
// Get all challenges 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const challenges = yield prisma_1.default.challenge.findMany();
        res.json({
            success: true,
            count: challenges.length,
            data: challenges,
        });
    }
    catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch challenges',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
/**
 * Get user's active challenges
 * GET /api/challenges/user/active
 * Protected route that requires authentication
 */
router.get('/user/active', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }
        // Get user's active challenges
        const userChallenges = yield prisma_1.default.userChallenge.findMany({
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
    }
    catch (error) {
        console.error('Error fetching user challenges:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user challenges',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
// Get challenge by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const challenge = yield prisma_1.default.challenge.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching challenge:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch challenge',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
/**
 * Join a challenge
 * POST /api/challenges/:id/join
 * Protected route that requires authentication
 */
router.post('/:id/join', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const challengeId = parseInt(req.params.id);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }
        // Check if challenge exists
        const challenge = yield prisma_1.default.challenge.findUnique({
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
        const existingUserChallenge = yield prisma_1.default.userChallenge.findUnique({
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
            const transactionResult = yield (0, wallet_1.processTransaction)(userId, -challenge.userStake, // Negative amount for deduction
            'CHALLENGE_JOIN', `Joined challenge: ${challenge.title}`, challengeId);
            // Create user challenge record
            const userChallenge = yield prisma_1.default.userChallenge.create({
                data: {
                    userId,
                    challengeId,
                    stakeAmount: challenge.userStake,
                    status: 'ACTIVE'
                }
            });
            // Update challenge participant count
            yield prisma_1.default.challenge.update({
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
        }
        catch (error) {
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
    }
    catch (error) {
        console.error('Error joining challenge:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while joining the challenge',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
exports.default = router;
