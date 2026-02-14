# FoodFinder.AI

**AI-powered ingredient risk scoring.** Snap a photo of any food label, get a personalized safety analysis based on your allergies, dietary preferences, and health goals.

Built at **PatriotHacks 2026**.

---

## What It Does

1. **Scan** — Point your camera at any ingredient label. Google Gemini extracts every ingredient from the image.
2. **Analyze** — A deterministic scoring engine cross-references each ingredient against your allergy profile, dietary restrictions, and health goals.
3. **Score** — Get a 0–100 risk score with clear conflict breakdowns (LOW / MEDIUM / HIGH) and a human-readable explanation.
4. **Listen** — Hear a spoken summary of the results via ElevenLabs text-to-speech.

---

## Tech Stack

| Layer           | Technology                                                                        |
| --------------- | --------------------------------------------------------------------------------- |
| **Frontend**    | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router           |
| **Backend**     | Python 3.11+, FastAPI, Pydantic, Uvicorn                                          |
| **AI / Vision** | Google Gemini API (ingredient extraction from images)                             |
| **Voice**       | ElevenLabs API (text-to-speech for result explanations)                           |
| **Database**    | Supabase (PostgreSQL — users, preferences, scan history)                          |
| **Scoring**     | Custom deterministic engine (no AI — pure logic with weighted conflict detection) |

---

## Project Structure

```
FoodFinder.AI/
├── .env.example              ← copy to .env and fill in keys
├── .gitignore
├── README.md                 ← you are here
├── SETUP.md                  ← detailed setup & troubleshooting guide
│
├── backend/
│   ├── requirements.txt
│   ├── migrations/           ← SQL migration files for Supabase
│   └── app/
│       ├── main.py           ← FastAPI entrypoint
│       ├── config.py         ← centralized env var configuration
│       ├── database.py       ← Supabase client initialization
│       ├── dependencies.py   ← FastAPI dependency injection
│       ├── routes/
│       │   ├── analyze.py    ← POST /analyze (core endpoint)
│       │   ├── user.py       ← user preferences & profile
│       │   └── health.py     ← GET /health
│       ├── services/
│       │   ├── gemini_service.py      ← image → ingredient list
│       │   ├── elevenlabs_service.py  ← text → speech audio
│       │   ├── scoring_service.py     ← thin wrapper around engine
│       │   └── supabase_service.py    ← DB read/write operations
│       ├── scoring_engine/            ← fully implemented
│       │   ├── engine.py              ← orchestrator
│       │   ├── conflict_detector.py   ← ingredient vs. profile matching
│       │   ├── risk_calculator.py     ← 0–100 score + risk level
│       │   ├── ingredient_metadata.py ← 90+ ingredient database
│       │   ├── weight_matrix.py       ← severity weights by conflict type
│       │   └── explanation_generator.py ← human-readable summaries
│       ├── core/
│       │   ├── exceptions.py  ← custom error classes
│       │   ├── logger.py      ← centralized logging
│       │   └── utils.py       ← image decoding, text normalization
│       └── tests/
│           ├── test_scoring_engine.py  ← unit tests for scoring
│           └── test_conflicts.py       ← edge case tests
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx               ← routing: /, /scan, /result, /profile, /settings
        ├── lib/
        │   └── utils.ts          ← cn() utility (clsx + tailwind-merge)
        ├── components/
        │   ├── landing/          ← landing page sections
        │   │   ├── Navbar.tsx
        │   │   ├── Hero.tsx
        │   │   ├── About.tsx
        │   │   ├── Features.tsx
        │   │   ├── HowItWorks.tsx
        │   │   ├── TechStack.tsx
        │   │   ├── CTA.tsx
        │   │   └── Footer.tsx
        │   ├── CameraView.tsx
        │   ├── ScoreCircle.tsx
        │   ├── RiskBadge.tsx
        │   ├── ConflictList.tsx
        │   ├── AudioPlayer.tsx
        │   ├── ARResultOverlay.tsx
        │   └── LoadingOverlay.tsx
        ├── screens/
        │   ├── LandingScreen.tsx
        │   ├── ScanScreen.tsx
        │   ├── ResultScreen.tsx
        │   ├── ProfileScreen.tsx
        │   └── SettingsScreen.tsx
        ├── context/
        │   └── UserContext.tsx
        ├── hooks/
        │   ├── useAnalyze.ts
        │   ├── useCameraPermission.ts
        │   └── useUserProfile.ts
        ├── services/
        │   ├── api.ts
        │   ├── analyzeService.ts
        │   └── userService.ts
        ├── types/
        │   ├── apiTypes.ts
        │   ├── scanTypes.ts
        │   └── userTypes.ts
        ├── utils/
        │   ├── constants.ts
        │   ├── errorHandler.ts
        │   └── formatters.ts
        └── styles/
            ├── globalStyles.css   ← Tailwind v4 theme (white & orange)
            └── theme.ts
```

---

## Execution Flow

```
User snaps photo of ingredient label
        ↓
POST /analyze (image + user_id)
        ↓
gemini_service.extract_ingredients(image)
        ↓
scoring_engine.engine.analyze(ingredients, user_profile)
    ├── conflict_detector  → find allergen/diet/processing conflicts
    ├── risk_calculator    → compute 0–100 score + LOW/MEDIUM/HIGH
    └── explanation_generator → build human-readable summary
        ↓
elevenlabs_service.generate_audio(explanation)
        ↓
supabase_service.save_result(scan_data)
        ↓
Return AnalyzeResponse → frontend displays results + plays audio
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- [Gemini API key](https://aistudio.google.com/apikey)
- [ElevenLabs API key](https://elevenlabs.io/)
- [Supabase project](https://supabase.com/) (URL + anon key)

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd FoodFinder.AI
cp .env.example .env
# Edit .env with your real API keys
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Run tests

```bash
cd backend
source venv/bin/activate
pytest app/tests/ -v
```

> See [SETUP.md](./SETUP.md) for detailed instructions, mobile testing over LAN, and troubleshooting.

---

## Implementation Status

| Component                                                           | Status                 |
| ------------------------------------------------------------------- | ---------------------- |
| Scoring engine (conflict detection, risk calculation, explanations) | Done                   |
| Scoring engine tests                                                | Done                   |
| Frontend landing page (white & orange theme)                        | Done                   |
| Frontend routing & screen scaffolding                               | Done                   |
| FastAPI server, routes, middleware                                  | Scaffolded (not wired) |
| Gemini service (image → ingredients)                                | Scaffolded             |
| ElevenLabs service (text → speech)                                  | Scaffolded             |
| Supabase service (DB operations)                                    | Scaffolded             |
| Database migrations                                                 | Scaffolded             |
| Frontend scan/result/profile screens                                | Scaffolded             |

---

## Database Schema

Three tables in Supabase (PostgreSQL):

- **users** — `id`, `email`, `created_at`
- **user_preferences** — `allergies[]`, `dietary_preferences[]`, `health_goals[]`, `strict_mode`
- **scan_history** — `product_name`, `raw_ingredients[]`, `normalized_ingredients[]`, `risk_score`, `risk_level`, `conflicts` (JSONB), `explanation`, `audio_url`

---

## Environment Variables

| Variable             | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `GEMINI_API_KEY`     | Google Gemini API for ingredient extraction               |
| `ELEVENLABS_API_KEY` | ElevenLabs API for text-to-speech                         |
| `SUPABASE_URL`       | Supabase project URL                                      |
| `SUPABASE_KEY`       | Supabase anon or service key                              |
| `BACKEND_HOST`       | Uvicorn bind host (default: `0.0.0.0`)                    |
| `BACKEND_PORT`       | Uvicorn bind port (default: `8000`)                       |
| `VITE_API_URL`       | Frontend → backend URL (default: `http://localhost:8000`) |

---

## License

This project was built for PatriotHacks 2026. No license specified.
