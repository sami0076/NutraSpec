/**
 * Parse an API error response into a user-facing message.
 */
export async function parseApiError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body?.detail) return body.detail;
  } catch {
    // body wasn't JSON
  }
  return `Request failed (${response.status})`;
}

/**
 * Wrap an error into a readable string.
 */
export function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unexpected error occurred';
}
