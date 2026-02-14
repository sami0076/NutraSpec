"""
Backend API — FastAPI. Orchestrates Gemini, scoring_engine, Eleven Labs, Supabase.
"""
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from scoring_engine import score_ingredients

app = FastAPI(title="FoodFinder.AI API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


def get_user_profile(user_id: str) -> dict | None:
    """Supabase: fetch user profile. TODO."""
    return None


def extract_ingredients(image_buffer: bytes) -> dict:
    """Gemini: image -> ingredient list. TODO."""
    return {"ingredients": []}


def get_tts_audio_url(text: str, voice_id: str | None = None) -> str | None:
    """Eleven Labs. TODO."""
    return None


@app.get("/health")
def health():
    return {"status": "ok", "service": "backend"}


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    try:
        profile = get_user_profile("") or {"allergens": [], "preferences": []}
        profile = {"allergens": profile.get("allergens", []), "preferences": profile.get("preferences", [])}
        image_bytes = await image.read()
        extracted = extract_ingredients(image_bytes)
        ingredients = extracted.get("ingredients", [])
        result = score_ingredients(ingredients, profile)
        tts_url = get_tts_audio_url(str(result.get("explanations", [])))
        return {
            "classification": result["classification"],
            "score": result["score"],
            "explanations": result["explanations"],
            "ingredients": ingredients,
            "tts_url": tts_url,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
