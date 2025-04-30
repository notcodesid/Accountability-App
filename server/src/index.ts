import express from "express";
import cors from "cors";
import challengesRoute from "./route/challenge";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Public routes
app.get("/", (req, res) => {
  res.send("lockin API Server");
});

// All routes are now public
app.use("/api/challenges", challengesRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});