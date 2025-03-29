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

// GET a single challenge by ID
const getChallengeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Convert string ID to number (as our model uses Int)
    const challengeId = parseInt(id);
    
    if (isNaN(challengeId)) {
      res.status(400).json({
        success: false,
        message: "Invalid challenge ID format"
      });
      return;
    }
    
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });
    
    if (!challenge) {
      res.status(404).json({
        success: false,
        message: "Challenge not found"
      });
      return;
    }
    
    // Return the challenge data
    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch challenge",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Register routes
router.get("/", getAllChallenges);
router.get("/:id", getChallengeById);  // New route for getting challenge by ID

export default router;  