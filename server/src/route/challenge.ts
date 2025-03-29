import express, { RequestHandler } from "express";
import prisma from "./prisma"

const router = express.Router();

// GET all challenges as JSON
const getAllChallenges: RequestHandler = async (_req, res) => {
  try {
    const challenges = await prisma.challenge.findMany();
    res.json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch challenges",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Register routes
router.get("/", getAllChallenges);

export default router;  