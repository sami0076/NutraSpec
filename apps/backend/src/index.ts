/**
 * Backend API — orchestrates Gemini extraction, Scoring Engine, Eleven Labs, Supabase.
 * Does NOT perform risk logic; delegates to scoring-engine package.
 */
import express from "express";
import { analyzeRouter } from "./routes/analyze.js";
import { healthRouter } from "./routes/health.js";

const app = express();
app.use(express.json());

app.use("/health", healthRouter);
app.use("/analyze", analyzeRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
