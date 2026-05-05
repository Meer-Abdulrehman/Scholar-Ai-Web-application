import os
import requests
from threading import Lock
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

TTS_URL    = "https://api.upliftai.org/v1/synthesis/text-to-speech"
VOICE_ID   = "v_8eelc901"
OUT_FORMAT = "MP3_22050_128"
_TTS_CACHE: dict[str, bytes] = {}
_CACHE_LOCK = Lock()


def text_to_speech(text: str) -> bytes:
    """
    Convert text to speech using Uplift Orator Studio API.
    Returns raw MP3 audio bytes.
    """
    api_key = os.getenv("UPLIFT_API_KEY", "")
    if not api_key:
        raise ValueError("UPLIFT_API_KEY not set in backend/.env")

    clean_text = (text or "").strip()
    if not clean_text:
        raise ValueError("TTS text cannot be empty")

    with _CACHE_LOCK:
        cached = _TTS_CACHE.get(clean_text)
    if cached:
        return cached

    response = requests.post(
        TTS_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type":  "application/json",
        },
        json={
            "voiceId":      VOICE_ID,
            "text":         clean_text,
            "outputFormat": OUT_FORMAT,
        },
        timeout=30,
    )

    if response.status_code != 200:
        raise RuntimeError(f"Uplift TTS error {response.status_code}: {response.text}")

    audio_bytes = response.content
    with _CACHE_LOCK:
        _TTS_CACHE[clean_text] = audio_bytes
    return audio_bytes


def prewarm_tts_cache(texts: list[str]) -> None:
    """Warm-up cache for common prompts to avoid first-request delay."""
    for text in texts:
        try:
            text_to_speech(text)
        except Exception:
            # Warm-up failures should not break startup.
            pass
