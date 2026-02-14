/**
 * Gemini — extraction only. Image → structured ingredient list.
 * Does NOT calculate risk or use computer vision beyond this single extraction step.
 */
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export type ExtractionResult = { ingredients: string[] };

/**
 * Send image buffer to Gemini; return list of ingredient strings.
 * Prompt design and JSON output schema live here (AI Integration responsibility).
 */
export async function extractIngredients(_imageBuffer: Buffer): Promise<ExtractionResult> {
  // TODO: Implement with Gemini vision API, enforce JSON structured output.
  return { ingredients: [] };
}
