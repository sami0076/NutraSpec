import { apiFetch } from './api';
import type { UserProfile } from '@/types/userTypes';

/** Payload for updating profile — user_id comes from JWT, not from client. */
export interface ProfileUpdatePayload {
  allergies?: string[];
  dietary_restrictions?: string[];
  health_conditions?: string[];
  health_goals?: string[];
}

/**
 * GET /user/profile — fetch the authenticated user's dietary profile.
 */
export async function fetchProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user/profile');
}

/**
 * PUT /user/profile — upsert the authenticated user's dietary profile.
 */
export async function updateProfile(payload: ProfileUpdatePayload): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
