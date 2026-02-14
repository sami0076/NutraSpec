# FoodFinder.AI — Setup Guide

## Prerequisites

- **Python 3.11+**
- **Node.js 20+** and **npm**
- A [Gemini API key](https://aistudio.google.com/apikey)
- An [ElevenLabs API key](https://elevenlabs.io/)
- A [Supabase](https://supabase.com/) project (URL + anon/service key)

---

## 1. Clone and configure environment

```bash
git clone <your-repo-url>
cd FoodFinder.AI
cp .env.example .env
```

Open `.env` and fill in your real keys. Every variable is documented inside the file.

---

## 2. Backend

### Install dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**.  
Docs at **http://localhost:8000/docs** (Swagger) and **http://localhost:8000/redoc**.

### Verify

```bash
curl http://localhost:8000/health
```

---

## 3. Frontend

### Install dependencies

```bash
cd frontend
npm install
```

### Run the dev server

```bash
npm run dev
```

Vite starts with HTTPS on your local network:

```
Local:   https://localhost:5173/
Network: https://<your-lan-ip>:5173/
```

### Demo on iPhone

1. Make sure your phone is on the **same WiFi** as your dev machine.
2. Open the **Network** URL shown in the terminal (e.g. `https://192.168.x.x:5173/`).
3. Safari will warn about the self-signed certificate — tap **Advanced → Continue** to proceed.
4. The camera API requires HTTPS, which `@vitejs/plugin-basic-ssl` provides automatically.

### Environment variables

The frontend reads env vars prefixed with `VITE_`. Set them in a `frontend/.env` file or export them in your shell:

```
VITE_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

---

## 4. Full-stack workflow

1. Start the backend in one terminal: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Start the frontend in another terminal: `cd frontend && npm run dev`
3. Open `https://localhost:5173/` in your browser (or the Network URL on your phone).
4. The frontend calls the backend at the URL defined by `VITE_API_URL`.

---

## Project structure

```
FoodFinder.AI/
├── .env.example          ← copy to .env and fill in keys
├── .gitignore
├── SETUP.md              ← you are here
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py           ← FastAPI entrypoint
│       ├── config.py         ← reads env vars
│       ├── database.py       ← Supabase client
│       ├── dependencies.py   ← FastAPI DI
│       ├── routes/           ← API endpoints
│       ├── services/         ← Gemini, ElevenLabs, Supabase wrappers
│       ├── scoring_engine/   ← deterministic risk scoring
│       ├── core/             ← exceptions, logger, utils
│       └── tests/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── screens/
        ├── components/
        ├── services/
        ├── hooks/
        ├── context/
        ├── types/
        ├── utils/
        └── styles/
```

---

## Troubleshooting

| Problem                      | Fix                                                                   |
| ---------------------------- | --------------------------------------------------------------------- |
| `uvicorn: command not found` | Activate the venv: `source backend/venv/bin/activate`                 |
| Camera doesn't work on phone | Must use the **https** Network URL, not http                          |
| Self-signed cert rejected    | Tap Advanced → Continue in Safari, or install the cert                |
| Frontend can't reach backend | Check `VITE_API_URL` and make sure backend is running on `0.0.0.0`    |
| CORS errors                  | Add CORS middleware in `backend/app/main.py` for your frontend origin |
