import { apiPostForm } from './api';
import type { AnalyzeResult } from '@/types/scanTypes';

export interface AnalyzeOptions {
  image: File | Blob;
  includeAudio?: boolean;
}

/**
 * POST /analyze — send a food label image for ingredient risk scoring.
 *
 * The user_id is extracted server-side from the Supabase JWT token
 * (attached automatically by api.ts). No need to pass it explicitly.
 */
export async function analyzeImage(opts: AnalyzeOptions): Promise<AnalyzeResult> {
  const formData = new FormData();
  formData.append('image', opts.image);
  formData.append('include_audio', opts.includeAudio ? 'true' : 'false');

  return apiPostForm<AnalyzeResult>('/analyze', formData);
}
