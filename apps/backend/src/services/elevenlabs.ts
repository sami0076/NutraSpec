/**
 * Eleven Labs — text-to-speech for reading out scan results to the user.
 * Called after scoring; optional in API response (ttsUrl or audio buffer).
 */
// import { ElevenLabsClient } from "elevenlabs";

// const eleven = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export type TtsOptions = { text: string; voiceId?: string };

/**
 * Generate TTS audio URL or buffer for the given result summary text.
 */
export async function getTtsAudioUrl(_options: TtsOptions): Promise<string | null> {
  // TODO: Call Eleven Labs API, return URL or signed URL for playback in mobile app.
  return null;
}
