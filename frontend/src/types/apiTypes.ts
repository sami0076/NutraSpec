/** Standard error shape returned by FastAPI. */
export interface ApiError {
  detail: string;
}

/** Health check response. */
export interface HealthResponse {
  status: string;
}
