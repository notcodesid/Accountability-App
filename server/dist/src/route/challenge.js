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
// GET all challenges as JSON
const getAllChallenges = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const challenges = yield prisma_1.default.challenge.findMany();
        res.json({
            success: true,
            count: challenges.length,
            data: challenges
        });
    }
    catch (error) {
        console.error("Error fetching challenges:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch challenges",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
// Register routes
router.get("/", getAllChallenges);
exports.default = router;
