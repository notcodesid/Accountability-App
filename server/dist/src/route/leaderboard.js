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
const router = express_1.default.Router();
/**
 * Get leaderboard data
 * GET /api/leaderboard
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch leaderboard entries sorted by rank
        const leaderboard = yield prisma_1.default.leaderboardUser.findMany({
            orderBy: {
                rank: 'asc'
            }
        });
        res.json({
            success: true,
            count: leaderboard.length,
            data: leaderboard
        });
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard data',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
/**
 * Get user ranking in leaderboard
 * GET /api/leaderboard/user/:userId
 */
router.get('/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Get user's leaderboard entry
        const leaderboardEntry = yield prisma_1.default.leaderboardUser.findUnique({
            where: { userId }
        });
        if (!leaderboardEntry) {
            return res.status(404).json({
                success: false,
                message: 'User not found in leaderboard',
            });
        }
        // Get entry count for users with more points (to calculate actual rank)
        const higherRankedCount = yield prisma_1.default.leaderboardUser.count({
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
            data: Object.assign(Object.assign({}, leaderboardEntry), { actualRank })
        });
    }
    catch (error) {
        console.error('Error fetching user leaderboard position:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user leaderboard position',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}));
exports.default = router;
