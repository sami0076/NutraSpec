import { apiPostForm } from './api';
import type { AnalyzeResult } from '@/types/scanTypes';
import type { UserProfile } from '@/types/userTypes';

export interface AnalyzeOptions {
  image: File | Blob;
  includeAudio?: boolean;
  /** Profile to use for analysis (sent when backend can't fetch it from auth) */
  profile?: UserProfile | null;
}

/**
 * POST /analyze — send a food label image for ingredient risk scoring.
 *
 * The user_id is extracted server-side from the Supabase JWT token
 * (attached automatically by api.ts). Pass profile when available
 * so analysis works even if auth/DB fetch fails.
 */
export async function analyzeImage(opts: AnalyzeOptions): Promise<AnalyzeResult> {
  const formData = new FormData();
  formData.append('image', opts.image);
  formData.append('include_audio', opts.includeAudio ? 'true' : 'false');

  if (opts.profile) {
    formData.append(
      'profile_json',
      JSON.stringify({
        allergies: opts.profile.allergies ?? [],
        dietary_restrictions: opts.profile.dietary_restrictions ?? [],
        health_conditions: opts.profile.health_conditions ?? [],
        health_goals: opts.profile.health_goals ?? [],
      }),
    );
  }

  return apiPostForm<AnalyzeResult>('/analyze', formData);
}
