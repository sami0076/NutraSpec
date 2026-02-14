/** Shared API and domain types (ingredients, user profile, risk result). */
export type UserProfile = { userId: string; allergens: string[]; preferences: string[] };
export type RiskResult = { classification: string; score: number; explanations: string[] };
