"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const challenge_1 = __importDefault(require("./route/challenge"));
const auth_1 = __importDefault(require("./route/auth"));
const wallet_1 = __importDefault(require("./route/wallet"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Public routes
app.get("/", (req, res) => {
    res.send("Accountability API Server");
});
// Auth routes
app.use("/api/auth", auth_1.default);
// Protected routes - require authentication
// Note: We're not applying authentication middleware to challenges routes yet
// to keep compatibility with the existing frontend. Add it later when the frontend is ready.
app.use("/api/challenges", challenge_1.default);
// Wallet routes - protected by default
app.use("/api/wallet", wallet_1.default);
// Example of a protected route
app.get("/api/protected", auth_2.authenticate, (req, res) => {
    res.json({
        success: true,
        message: "This is a protected route",
        user: req.user,
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
