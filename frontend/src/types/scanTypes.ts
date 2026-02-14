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
  unknown_ingredients: string[];
  summary: string;
  total_ingredients: number;
  conflict_count: number;
  audio_base64?: string | null;
}
