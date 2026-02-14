import { API_BASE_URL } from '@/utils/constants';
import { parseApiError } from '@/utils/errorHandler';
import { supabase } from '@/lib/supabase';

/**
 * Get the current Supabase access token (if logged in).
 */
async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/**
 * Thin wrapper over fetch that:
 * - Prepends API_BASE_URL
 * - Attaches Supabase auth token as Authorization header
 * - Throws with a readable message on non-2xx responses
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const token = await getAccessToken();

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    const message = await parseApiError(res);
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/**
 * POST multipart form data (used for image upload).
 * Auth token is attached automatically.
 */
export async function apiPostForm<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Don't set Content-Type — browser sets it with boundary for multipart

  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!res.ok) {
    const message = await parseApiError(res);
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
