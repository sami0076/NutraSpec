// API URL, risk levels, thresholds
// In dev: use /api proxy (avoids CORS, mixed content with HTTPS frontend). In prod: use VITE_API_URL.
export const API_BASE_URL =
  import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL ?? 'http://localhost:8000');
