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
exports.authenticate = void 0;
const jwt_1 = require("../lib/jwt");
const prisma_1 = __importDefault(require("../route/prisma"));
/**
 * Middleware to authenticate requests using JWT tokens
 */
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get authorization header
        const authHeader = req.headers.authorization;
        // Extract token from header
        const token = (0, jwt_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication token is required',
            });
            return;
        }
        // Verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
            return;
        }
        // Check if user exists in database
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Attach user to request object
        req.user = user;
        // Continue to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error',
        });
        return;
    }
});
exports.authenticate = authenticate;
