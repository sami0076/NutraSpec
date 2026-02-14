# Architecture

**backend/** — API (FastAPI) + scoring_engine (deterministic, no AI). Talks to Gemini, Eleven Labs, Supabase.  
**web/** — Frontend. Camera → analyze → show result (+ optional Eleven Labs read-out).

Flow: User → web → backend → Gemini (image → ingredients) → backend → scoring_engine (ingredients + profile → risk) → backend → web.

AI extracts. Logic scores. See README to run.
