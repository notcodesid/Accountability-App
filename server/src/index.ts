import express from "express";
import cors from "cors";
import challengesRoute from "./route/challenge";
import authRoutes from "./route/auth";
import walletRoutes from "./route/wallet";
import { authenticate } from "./middleware/auth";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Public routes
app.get("/", (req, res) => {
  res.send("Accountability API Server");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Protected routes - require authentication
// Note: We're not applying authentication middleware to challenges routes yet
// to keep compatibility with the existing frontend. Add it later when the frontend is ready.
app.use("/api/challenges", challengesRoute);

// Wallet routes - protected by default
app.use("/api/wallet", walletRoutes);

// Example of a protected route
app.get("/api/protected", authenticate, (req, res) => {
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