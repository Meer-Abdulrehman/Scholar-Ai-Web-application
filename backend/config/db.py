from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

_client: MongoClient = None


def connect_db():
    global _client
    uri = os.getenv("MONGODB_URI", "")
    if not uri:
        raise ValueError("MONGODB_URI not set in backend/.env")
    _client = MongoClient(uri)
    _client.admin.command("ping")
    print("[OK] MongoDB Atlas connected successfully!")
    return _client


def get_db():
    global _client
    if _client is None:
        connect_db()
    return _client["student_advisor"]
