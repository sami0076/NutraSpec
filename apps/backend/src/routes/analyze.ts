/**
 * Analyze flow: image upload → Gemini extraction → Scoring Engine → (optional) Eleven Labs TTS.
 * Types from shared-types; scoring from scoring-engine package.
 */
import { Router } from "express";
import multer from "multer";
// import { extractIngredients } from "../services/gemini.js";
// import { scoreIngredients } from "scoring-engine";
// import { getTtsAudioUrl } from "../services/elevenlabs.js";
// import { getUserProfile } from "../services/supabase.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
export const analyzeRouter = Router();

analyzeRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    // TODO: 1. Get user profile (Supabase) from auth/session
    // TODO: 2. extractIngredients(req.file.buffer) → Gemini
    // TODO: 3. scoreIngredients(ingredients, userProfile) → scoring-engine
    // TODO: 4. Optional: getTtsAudioUrl(result summary) → Eleven Labs
    // TODO: 5. Return { risk, score, explanations, ttsUrl? }
    res.status(501).json({ error: "Not implemented: wire Gemini + scoring-engine + Eleven Labs" });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});
