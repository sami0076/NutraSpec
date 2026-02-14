# FoodFinder.AI

**AI-powered ingredient risk scoring.** Snap a photo of any food label, get a personalized safety analysis based on your allergies, dietary preferences, and health goals.

Built at **PatriotHacks 2026**.

---

## What It Does

1. **Scan** — Point your camera at any ingredient label. Google Gemini extracts every ingredient from the image.
2. **Analyze** — Gemini grades ingredients against your allergy profile, dietary restrictions, and health goals.
3. **Score** — Get a 0–100 risk score with clear conflict breakdowns (Low / Medium / High Risk) and a human-readable summary.
4. **Listen** — Hear a spoken summary of the results via ElevenLabs text-to-speech.
5. **Cache** — Analysis results are cached by (ingredients + profile) hash for consistency and speed.
6. **Allergen check** — Deterministic backup flags allergen derivatives (e.g. peanut butter when you have peanut allergy).

---

## Tech Stack

| Layer           | Technology                                                                        |
| --------------- | --------------------------------------------------------------------------------- |
| **Frontend**    | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Router           |
| **Backend**     | Python 3.11+, FastAPI, Pydantic, Uvicorn                                          |
| **AI / Vision** | Google Gemini API (vision extraction + risk analysis — no separate scoring engine) |
| **Voice**       | ElevenLabs API (text-to-speech for result explanations)                           |
| **Database**    | Supabase (PostgreSQL — user profiles, analysis cache)                             |

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
│   ├── migrations/
│   │   ├── 001_user_profiles.sql   ← user_profiles table
│   │   └── 002_analysis_cache.sql  ← analysis_cache table
│   └── app/
│       ├── main.py           ← FastAPI entrypoint, CORS, route registration, dotenv
│       ├── config.py         ← env vars (GEMINI, SUPABASE, etc.)
│       ├── database.py       ← Supabase client (service role)
│       ├── dependencies.py   ← auth: Supabase API + optional JWT verification
│       ├── models.py         ← Pydantic: AnalyzeResult, FlaggedIngredient, ProfileUpdatePayload
│       ├── routes/
│       │   ├── __init__.py
│       │   ├── analyze.py    ← POST /analyze (image, include_audio, profile_json)
│       │   ├── user.py       ← GET/PUT /user/profile (auth required)
│       │   └── health.py     ← GET /health
│       ├── services/
│       │   ├── __init__.py
│       │   ├── gemini_service.py      ← vision + analysis (retry on 429)
│       │   ├── elevenlabs_service.py  ← text → speech (MP3 bytes)
│       │   ├── supabase_service.py    ← user profiles + analysis cache
│       │   └── allergen_check.py     ← deterministic allergen keyword check
│       └── core/
│           ├── __init__.py
│           ├── exceptions.py  ← custom error classes
│           ├── logger.py     ← logging helper
│           └── utils.py      ← to_title_case, etc.
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── lib/
        │   ├── supabase.ts   ← Supabase client
        │   └── utils.ts      ← cn() utility (clsx + tailwind-merge)
        ├── components/
        │   ├── landing/
        │   │   ├── Navbar.tsx
        │   │   ├── Hero.tsx
        │   │   ├── About.tsx
        │   │   ├── Features.tsx
        │   │   ├── HowItWorks.tsx
        │   │   ├── TechStack.tsx
        │   │   ├── BentoShowcase.tsx
        │   │   ├── CTA.tsx
        │   │   └── Footer.tsx
        │   ├── ui/
        │   │   └── button.tsx
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
        │   ├── SettingsScreen.tsx
        │   └── AuthScreen.tsx
        ├── navigation/
        │   └── RootNavigator.tsx
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
POST /analyze (image, include_audio, profile_json from frontend)
        ↓
gemini_service.analyze_vision(image) → product_name, brand, ingredients
        ↓
profile = get_user_profile(user_id from JWT) merged with profile_json
        ↓
allergen_check.check_allergens(ingredients, allergies) → deterministic flags
        ↓
cache_key = hash(ingredients + profile)
        ↓
[Cache hit?] → cached analysis + allergen_check + optional TTS
[Cache miss] → gemini_service.analyze_ingredients(ingredients, profile)
        ↓
allergen_check.merge_allergen_flags(analysis, det_flags) → override if Gemini missed
        ↓
set_cached_analysis(cache_key, analysis)
        ↓
[include_audio=true?] → elevenlabs_service.text_to_speech(summary)
        ↓
Return AnalyzeResult → frontend displays results + plays audio
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- [Gemini API key](https://aistudio.google.com/apikey)
- [ElevenLabs API key](https://elevenlabs.io/)
- [Supabase project](https://supabase.com/) (URL, service role key, anon key)

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
```

Run the migrations in Supabase SQL Editor (in order):

- `migrations/001_user_profiles.sql`
- `migrations/002_analysis_cache.sql`

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> See [SETUP.md](./SETUP.md) for detailed instructions, mobile testing over LAN, and troubleshooting.

---

## Implementation Status

| Component                                              | Status |
| ------------------------------------------------------ | ------ |
| Backend (backend/) — FastAPI, routes, services          | Done   |
| Gemini service (vision + analysis, retry on 429)       | Done   |
| Deterministic allergen check (allergen_check.py)       | Done   |
| Profile fallback (profile_json from frontend)           | Done   |
| Analysis cache (Supabase)                              | Done   |
| ElevenLabs TTS                                         | Done   |
| User profile (GET/PUT /user/profile, auth via Supabase API) | Done   |
| Database migrations (user_profiles, analysis_cache)      | Done   |
| Frontend landing, scan, result, profile, auth screens   | Done   |

---

## Database Schema

Two tables in Supabase (PostgreSQL):

- **user_profiles** — `user_id` (UUID PK), `allergies`, `dietary_restrictions`, `health_conditions`, `health_goals` (JSONB arrays)
- **analysis_cache** — `cache_key` (text PK), `result` (JSONB)

---

## Environment Variables

| Variable                     | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `GEMINI_API_KEY`             | Google Gemini API (vision + analysis)                      |
| `ELEVENLABS_API_KEY`         | ElevenLabs API for text-to-speech                         |
| `SUPABASE_URL`               | Supabase project URL                                      |
| `SUPABASE_SERVICE_ROLE_KEY`  | Supabase service role key (backend operations)            |
| `SUPABASE_JWT_SECRET`        | Optional. Local JWT verification (faster). Omit to use Supabase API. |
| `VITE_SUPABASE_ANON_KEY`     | Supabase anon key (frontend auth + backend token verification) |
| `BACKEND_HOST`               | Uvicorn bind host (default: `0.0.0.0`)                     |
| `BACKEND_PORT`               | Uvicorn bind port (default: `8000`)                       |
| `VITE_API_URL`               | Frontend → backend URL (production)                       |
| `VITE_SUPABASE_URL`          | Supabase URL (frontend)                                   |

---

## License

This project was built for PatriotHacks 2026. No license specified.
