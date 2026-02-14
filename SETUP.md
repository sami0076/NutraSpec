# FoodFinder.AI — Local setup guide

Use this guide to clone the repo from GitHub and run the project on your machine using **Docker** (recommended) or a local Node/pnpm setup.

---

## Prerequisites

- **Git**
- **Docker & Docker Compose** (for running the stack in containers)
- **Node.js 20+** and **pnpm** (only if you run apps locally without Docker; install pnpm via `npm install -g pnpm`)

---

## 1. Clone the repo

```bash
git clone https://github.com/YOUR_ORG/FoodFinder.AI.git
cd FoodFinder.AI
```

_(Replace `YOUR_ORG` with your GitHub org or username.)_

---

## 2. Environment variables

The backend needs API keys and Supabase config. Create env files from the examples:

```bash
# Backend (required for API + Gemini + Eleven Labs + Supabase)
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env` and fill in:

| Variable               | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `PORT`                 | Backend port (default `4000`)                        |
| `GEMINI_API_KEY`       | Google AI (Gemini) API key for ingredient extraction |
| `ELEVENLABS_API_KEY`   | Eleven Labs API key for TTS                          |
| `SUPABASE_URL`         | Your Supabase project URL                            |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (keep secret)              |

**Do not commit `.env` files.** They are listed in `.gitignore`.

---

## 3. Run with Docker (recommended)

**Complete step 2 first** (create `apps/backend/.env`), or the backend container may exit.

From the **project root**:

```bash
docker compose up --build
```

This builds and starts:

- **web** — Vite dev server (frontend) at **http://localhost:5173**
- **backend** — API at **http://localhost:4000**

To run in the background:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

---

## 4. Run without Docker (local dev)

If you prefer to run the backend and web app directly on your machine:

### 4.1 Install dependencies

From the **project root** (pnpm workspace):

```bash
pnpm install
```

_(If you don’t have pnpm: `npm install -g pnpm`)_

### 4.2 Start the backend

```bash
pnpm dev:backend
```

Backend runs at **http://localhost:4000**.

### 4.3 Start the web app

In a **second terminal**, from the project root:

```bash
pnpm dev:web
```

Frontend runs at **http://localhost:5173**.

---

## 5. Verify setup

- **Frontend:** Open http://localhost:5173 — you should see the FoodFinder.AI web app.
- **Backend:** Open http://localhost:4000/health — you should get `{"status":"ok","service":"backend"}`.

---

## 6. Project structure (reference)

| Path                      | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `apps/web`                | Vite + React frontend (TypeScript)                         |
| `apps/backend`            | Express API, Gemini, Eleven Labs, Supabase, scoring-engine |
| `packages/scoring-engine` | Deterministic risk scoring (no AI)                         |
| `packages/shared-types`   | Shared types for API contracts                             |
| `ARCHITECTURE.md`         | System components and data flow                            |

---

## Troubleshooting

- **Port already in use:** Change `PORT` in `apps/backend/.env` or in `docker-compose.yml` for the backend; change the web port in `apps/web/vite.config.ts` or in the compose file.
- **Docker build fails:** Ensure Docker Desktop is running and you have enough disk space. Try `docker compose build --no-cache` and then `docker compose up`.
- **Backend env:** If the backend exits or returns 500s, check that all required keys in `apps/backend/.env` are set and valid (Gemini, Eleven Labs, Supabase).
- **pnpm not found:** Use `npm install -g pnpm` or enable Corepack: `corepack enable && corepack prepare pnpm@latest --activate`.

---

For architecture and responsibilities, see **ARCHITECTURE.md**.
