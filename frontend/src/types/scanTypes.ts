/** Risk classification levels returned by the scoring engine. */
export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';

/** A single flagged ingredient with scoring detail. */
export interface FlaggedIngredient {
  ingredient: string;
  risk_level: RiskLevel;
  reasons: string[];
  severity: number; // 0.0 – 1.0
}

/** Full analysis result from POST /analyze. */
export interface AnalyzeResult {
  score: number; // 0–100, higher = safer
  risk_classification: RiskLevel;
  flagged_ingredients: FlaggedIngredient[];
  summary: string;
  total_ingredients: number;
  conflict_count: number;
  /** Product name from vision analysis */
  product_name?: string;
  /** Brand from vision analysis (null if not visible) */
  brand?: string | null;
  /** Full list of ingredients from vision analysis */
  ingredients?: string[];
  /** Vision extraction confidence: high | medium | low */
  confidence?: string;
  audio_base64?: string | null;
}
