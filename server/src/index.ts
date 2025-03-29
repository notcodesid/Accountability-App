import express from "express";
import cors from "cors";
import challengesRoute from "./route/challenge";
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

// Use the challenges API route
app.use("/api/challenges", challengesRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});