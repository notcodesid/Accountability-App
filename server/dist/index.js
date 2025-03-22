import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import challengeRoutes from './routes/challenges.js';
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();
// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.get('/', (req, res) => {
    res.send('Accountability-as-a-Service API');
});
app.use('/auth', authRoutes);
app.use('/challenges', challengeRoutes);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
