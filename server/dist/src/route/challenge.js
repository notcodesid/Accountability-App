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
const prisma_1 = __importDefault(require("../lib/prisma"));
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
// Get challenge by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const challenge = yield prisma_1.default.challenge.findUnique({
            where: { id },
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
exports.default = router;
