/** User dietary profile as returned by the API. */
export interface UserProfile {
  user_id: string;
  allergies: string[];
  dietary_restrictions: string[];
  health_conditions: string[];
  health_goals: string[];
}

/**
 * Payload for updating a user profile.
 * user_id is extracted server-side from the Supabase JWT — not sent by the client.
 */
export interface ProfileUpdatePayload {
  allergies?: string[];
  dietary_restrictions?: string[];
  health_conditions?: string[];
  health_goals?: string[];
}
