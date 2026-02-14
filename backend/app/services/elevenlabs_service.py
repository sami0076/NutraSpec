"""ElevenLabs text-to-speech for result summaries."""

from __future__ import annotations

import os
from typing import Optional

try:
    from elevenlabs.client import ElevenLabs
except ImportError:
    ElevenLabs = None

# Default voice: Rachel (ElevenLabs preset)
DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"


def text_to_speech(
    text: str,
    api_key: Optional[str] = None,
    voice_id: str = DEFAULT_VOICE_ID,
) -> Optional[bytes]:
    """Generate audio from text. Returns raw MP3 bytes or None on failure."""
    if not text:
        return None
    key = api_key or os.getenv("ELEVENLABS_API_KEY")
    if not key or ElevenLabs is None:
        return None
    try:
        client = ElevenLabs(api_key=key)
        audio = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )
        if hasattr(audio, "__iter__") and not isinstance(audio, (bytes, str)):
            return b"".join(audio) if audio else None
        return bytes(audio) if audio else None
    except Exception:
        return None
