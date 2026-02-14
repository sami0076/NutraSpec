/**
 * Supabase — user profile and any persisted data.
 * Used to fetch user profile (allergens, preferences) for the scoring engine.
 */
// import { createClient } from "@supabase/supabase-js";
// import type { UserProfile } from "shared-types";

// const supabase = createClient(
//   process.env.SUPABASE_URL ?? "",
//   process.env.SUPABASE_SERVICE_KEY ?? ""
// );

export type UserProfile = {
  userId: string;
  allergens: string[];
  preferences: string[];
  // extend per product needs
};

/**
 * Get user profile by user id (from auth/session).
 */
export async function getUserProfile(_userId: string): Promise<UserProfile | null> {
  // TODO: Fetch from Supabase (e.g. profiles table).
  return null;
}
