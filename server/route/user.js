import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const SECRET_KEY = "supersecret";

// Signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { 
                name, 
                email, 
                password: hashedPassword 
            },
        });

        const token = jwt.sign({ userId: user.id }, SECRET_KEY);
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: "User already exists" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY);
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;