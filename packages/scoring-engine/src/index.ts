/** Deterministic scoring only. Input: ingredient list + user profile. No AI, no images. */
export function scoreIngredients(
  _ingredients: string[],
  _profile: { allergens: string[]; preferences: string[] }
): { classification: string; score: number; explanations: string[] } {
  return { classification: "unknown", score: 0, explanations: [] };
}
