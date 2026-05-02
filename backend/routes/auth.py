from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from bson import ObjectId
import threading

from models.user import UserSignup, UserLogin
from services.auth_service import hash_password, verify_password, create_token, decode_token
from services.email_service import send_welcome_email, send_login_alert
from config.db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])
bearer_scheme = HTTPBearer()


def _user_dict(doc: dict) -> dict:
    return {
        "id":    str(doc["_id"]),
        "name":  doc.get("name", ""),
        "email": doc.get("email", ""),
        "role":  doc.get("role", "student"),
    }


@router.post("/signup")
def signup(data: UserSignup):
    db    = get_db()
    users = db["users"]

    if users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")

    doc = {
        "name":          data.name,
        "email":         data.email,
        "password_hash": hash_password(data.password),
        "created_at":    datetime.utcnow(),
        "role":          "student",
    }
    inserted = users.insert_one(doc)
    doc["_id"] = inserted.inserted_id

    token = create_token({"sub": str(inserted.inserted_id), "email": data.email})

    try:
        threading.Thread(
            target=send_welcome_email,
            args=(data.email, data.name),
            daemon=True,
        ).start()
    except Exception as exc:
        print(f"[WARNING] Welcome email failed: {exc}")

    return {"success": True, "token": token, "user": _user_dict(doc)}


@router.post("/login")
def login(data: UserLogin):
    db    = get_db()
    users = db["users"]

    user_doc = users.find_one({"email": data.email})
    if not user_doc or not verify_password(data.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_token({"sub": str(user_doc["_id"]), "email": data.email})

    try:
        threading.Thread(
            target=send_login_alert,
            args=(data.email, user_doc.get("name", "")),
            daemon=True,
        ).start()
    except Exception as exc:
        print(f"[WARNING] Login alert email failed: {exc}")

    return {"success": True, "token": token, "user": _user_dict(user_doc)}


@router.get("/me")
def me(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = decode_token(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token.")

    db = get_db()
    try:
        user_doc = db["users"].find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user ID.")

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"success": True, "user": _user_dict(user_doc)}
