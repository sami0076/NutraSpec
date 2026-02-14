"""
ElevenLabs Service — Text-to-Speech
Converts analysis summary text to audio for the AudioPlayer component.
"""

from __future__ import annotations

import os
from typing import Optional

from elevenlabs.client import ElevenLabs


# Defaults


DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Rachel
DEFAULT_MODEL = "eleven_multilingual_v2"
DEFAULT_OUTPUT_FORMAT = "mp3_44100_128"


# Public API

def text_to_speech(
    text: str,
    api_key: Optional[str] = None,
    voice_id: str = DEFAULT_VOICE_ID,
    model_id: str = DEFAULT_MODEL,
    output_format: str = DEFAULT_OUTPUT_FORMAT,
) -> Optional[bytes]:
    """
    Convert text to speech using ElevenLabs API.

    Args:
        text: Text to convert (analysis summary).
        api_key: ElevenLabs API key. If None, uses ELEVENLABS_API_KEY env var.
        voice_id: Voice ID (default: Rachel).
        model_id: Model ID (default: eleven_multilingual_v2).
        output_format: Output format (default: mp3_44100_128).

    Returns:
        Raw audio bytes (MP3), or None if API key is missing or conversion fails.
    """
    key = api_key or os.getenv("ELEVENLABS_API_KEY")
    if not key:
        return None

    if not text or not text.strip():
        return None

    try:
        client = ElevenLabs(api_key=key)
        result = client.text_to_speech.convert(
            text=text.strip(),
            voice_id=voice_id,
            model_id=model_id,
            output_format=output_format,
        )

        # convert() may return bytes or a generator of bytes
        if isinstance(result, bytes):
            return result
        if hasattr(result, "__iter__"):
            return b"".join(result)
        return None

    except Exception:
        return None
