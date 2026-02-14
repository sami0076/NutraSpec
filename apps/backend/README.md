# Backend API

- **Responsibilities:** Image upload, Gemini extraction, call Scoring Engine, Eleven Labs TTS, Supabase.
- **Not responsible:** Risk formula or ingredient metadata (those live in `packages/scoring-engine`).

## Env

Create `.env` (see `.env.example`):

- `GEMINI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `PORT` (optional)

## Run

- `pnpm dev` — development with watch
- `pnpm build && pnpm start` — production
