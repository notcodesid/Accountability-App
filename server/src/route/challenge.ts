import express, { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET all challenges as JSON
router.get("/", async (_req, res) => {
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
});

export default router;  