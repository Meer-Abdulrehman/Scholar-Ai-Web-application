import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

TTS_URL    = "https://api.upliftai.org/v1/synthesis/text-to-speech"
VOICE_ID   = "v_8eelc901"
OUT_FORMAT = "MP3_22050_128"


def text_to_speech(text: str) -> bytes:
    """
    Convert text to speech using Uplift Orator Studio API.
    Returns raw MP3 audio bytes.
    """
    api_key = os.getenv("UPLIFT_API_KEY", "")
    if not api_key:
        raise ValueError("UPLIFT_API_KEY not set in backend/.env")

    response = requests.post(
        TTS_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type":  "application/json",
        },
        json={
            "voiceId":      VOICE_ID,
            "text":         text,
            "outputFormat": OUT_FORMAT,
        },
        timeout=30,
    )

    if response.status_code != 200:
        raise RuntimeError(f"Uplift TTS error {response.status_code}: {response.text}")

    return response.content
