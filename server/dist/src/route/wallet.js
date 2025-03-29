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
exports.processTransaction = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**
 * Get user wallet information
 * GET /api/wallet
 * Protected route that requires authentication
 */
const getWalletHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // The authenticate middleware will already have verified the token
        // and added the user to the request object
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }
        // Get user wallet information
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                wallet: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Return just the wallet balance value from the database
        res.status(200).json({
            success: true,
            data: {
                balance: user.wallet
            },
        });
    }
    catch (error) {
        console.error('Error getting wallet information:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while getting wallet information',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
/**
 * Process a transaction and update wallet balance
 * This is an internal utility function, not exposed as an API endpoint
 */
const processTransaction = (userId, amount, type, description, relatedChallengeId) => __awaiter(void 0, void 0, void 0, function* () {
    // Start a transaction to ensure both operations complete or fail together
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Get current wallet balance
        const user = yield tx.user.findUnique({
            where: { id: userId },
            select: { wallet: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // 2. Check if user has enough balance for debits (negative amounts)
        if (amount < 0 && user.wallet + amount < 0) {
            throw new Error('Insufficient wallet balance');
        }
        // 3. Update wallet balance
        const updatedUser = yield tx.user.update({
            where: { id: userId },
            data: { wallet: user.wallet + amount },
        });
        // 4. Create transaction record
        const transaction = yield tx.transaction.create({
            data: {
                userId,
                amount,
                type,
                description,
                relatedChallengeId,
            },
        });
        return {
            newBalance: updatedUser.wallet,
            transaction,
        };
    }));
});
exports.processTransaction = processTransaction;
/**
 * Get transaction history for the user
 * GET /api/wallet/transactions
 * Protected route that requires authentication
 */
const getTransactionsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Get the user's transaction history
        const transactions = yield prisma_1.default.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            success: true,
            data: transactions,
        });
    }
    catch (error) {
        console.error('Error getting transaction history:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while getting transaction history',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// Register routes
router.get('/', auth_1.authenticate, getWalletHandler);
router.get('/transactions', auth_1.authenticate, getTransactionsHandler);
exports.default = router;
