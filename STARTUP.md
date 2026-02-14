# Get the app running

For teammates: follow this once after cloning.

## 1. Prerequisites

- **Docker + Docker Compose** (easiest), or
- **Node 20+** and **pnpm** for web, **Python 3.11+** for backend (if not using Docker)

## 2. Clone

```bash
git clone https://github.com/YOUR_ORG/FoodFinder.AI.git
cd FoodFinder.AI
```

(Replace `YOUR_ORG` with your org or username.)

## 3. Backend env (required)

The backend needs API keys. Create env from the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set:

- `GEMINI_API_KEY` — Google AI (Gemini) for ingredient extraction
- `ELEVENLABS_API_KEY` — Eleven Labs for TTS
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_KEY` — Supabase service role key

You can leave values empty to run the app; the analyze flow will stub until you add keys.

## 4. Run with Docker

From the project root:

```bash
docker compose up --build
```

- **Web:** http://localhost:5173
- **API:** http://localhost:4000
- **Health check:** http://localhost:4000/health

Stop with `Ctrl+C`. Detached: `docker compose up --build -d`.

## 5. Run without Docker

**Terminal 1 — backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 4000
```

**Terminal 2 — web:**

```bash
pnpm install
pnpm dev:web
```

Then open http://localhost:5173.

## 6. Verify

- Frontend loads at :5173
- http://localhost:4000/health returns `{"status":"ok","service":"backend"}`

---

**Troubleshooting:** Port in use → change port in `backend/.env` (backend) or `web/vite.config.ts` (web). Docker build fails → ensure Docker Desktop is running and you have `backend/.env` (can be empty keys).
