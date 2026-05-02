from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from jose import jwt, JWTError
import os, sys
from pathlib import Path

# Load backend/.env — works whether you run from /backend or project root
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

from routes.auth import router as auth_router
from services.prediction import predict_grade, explain_performance
from services.career import recommend_careers
from services.tts import text_to_speech
from vector_db.db import save_student_analysis, get_history, get_analysis_by_id, get_stats, find_similar_students
from config.db import connect_db

# Agent — loaded lazily so server starts even without GROQ_API_KEY
_agent_module = None

def _get_agent():
    global _agent_module
    if _agent_module is None:
        sys.path.insert(0, str(Path(__file__).parent.parent))
        from agent.student_agent import get_agent_advice
        _agent_module = get_agent_advice
    return _agent_module

app = FastAPI(
    title="AI Student Advisor API",
    description="Grade Prediction, Career Recommendation, SHAP Explanation & AI Advice",
    version="1.0.0",
)

# CORS must be added first — before any routes
frontend_origin = os.getenv("FRONTEND_URL", "https://scholar-ai-web-application.vercel.app")
# Allow the main frontend origin and local dev. Also accept Vercel preview domains
# via a regex so preview deployments (which use dynamic subdomains) can access the API.
vercel_origin_regex = os.getenv("VERCEL_ORIGIN_REGEX", r"^https://.*\.vercel\.app$")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "http://localhost:5173"],
    allow_origin_regex=vercel_origin_regex,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# ── Optional auth helper — extracts user_id from JWT if present ──────────────
_bearer = HTTPBearer(auto_error=False)

def _get_user_id(creds: HTTPAuthorizationCredentials = Depends(_bearer)) -> str | None:
    if not creds:
        return None
    try:
        payload = jwt.decode(
            creds.credentials,
            os.getenv("SECRET_KEY", "scholarai-super-secret-2025"),
            algorithms=["HS256"],
        )
        return payload.get("sub")
    except (JWTError, Exception):
        return None


@app.on_event("startup")
def startup():
    print(">> AI Student Advisor API starting...")
    try:
        connect_db()
    except Exception as e:
        print(f"[WARNING] MongoDB connection failed: {e}")


# ── Request Schema ────────────────────────────────────────────────────────────

class StudentInput(BaseModel):
    study_hours:     float = Field(..., ge=0, le=24,  example=5)
    attendance:      float = Field(..., ge=0, le=100, example=85)
    prev_grade:      float = Field(..., ge=0, le=100, example=70)
    sleep_hours:     float = Field(..., ge=0, le=24,  example=7)
    extracurricular: int   = Field(..., ge=0, le=1,   example=1)
    gender:          int   = Field(..., ge=0, le=1,   example=1)
    math:     float = Field(default=70, ge=0, le=100)
    science:  float = Field(default=70, ge=0, le=100)
    english:  float = Field(default=70, ge=0, le=100)
    computer: float = Field(default=70, ge=0, le=100)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "AI Student Advisor API is running ✅"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(data: StudentInput):
    """Predict final grade (RF + LR) and Pass/Fail status."""
    try:
        result = predict_grade(
            data.study_hours, data.attendance, data.prev_grade,
            data.sleep_hours, data.extracurricular, data.gender,
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/recommend")
def recommend(data: StudentInput):
    """Recommend top 3 careers based on subject grades."""
    try:
        careers = recommend_careers(
            data.math, data.science, data.english, data.computer
        )
        return {"success": True, "data": careers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/explain")
def explain(data: StudentInput):
    """SHAP values — why did the model give this grade?"""
    try:
        result = explain_performance(
            data.study_hours, data.attendance, data.prev_grade,
            data.sleep_hours, data.extracurricular, data.gender,
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/advice")
def advice(data: StudentInput):
    """
    Agentic AI advice — LangChain ReAct agent with Groq LLM.
    Agent calls predict_grade, explain_performance, recommend_career tools
    on its own and returns a personalized response.
    Requires GROQ_API_KEY in backend/.env
    """
    try:
        agent_fn = _get_agent()
        text = agent_fn(
            study_hours=data.study_hours,
            attendance=data.attendance,
            prev_grade=data.prev_grade,
            sleep_hours=data.sleep_hours,
            extracurricular=data.extracurricular,
            gender=data.gender,
            math=data.math,
            science=data.science,
            english=data.english,
            computer=data.computer,
        )
        return {"success": True, "data": {"advice": text}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
def analyze(data: StudentInput, user_id: str | None = Depends(_get_user_id)):
    """
    All-in-one endpoint — predict + recommend + explain + advice.
    Frontend should call this single endpoint.
    """
    try:
        pred    = predict_grade(
            data.study_hours, data.attendance, data.prev_grade,
            data.sleep_hours, data.extracurricular, data.gender,
        )
        shap_r  = explain_performance(
            data.study_hours, data.attendance, data.prev_grade,
            data.sleep_hours, data.extracurricular, data.gender,
        )
        careers = recommend_careers(
            data.math, data.science, data.english, data.computer,
            avg_grade=pred.get("avg_grade"),
            status=pred.get("status"),
            level=pred.get("level"),
        )

        # Agent generates advice only when GROQ_API_KEY is set
        advice_text = None
        if os.getenv("GROQ_API_KEY"):
            try:
                agent_fn    = _get_agent()
                advice_text = agent_fn(
                    study_hours=data.study_hours,
                    attendance=data.attendance,
                    prev_grade=data.prev_grade,
                    sleep_hours=data.sleep_hours,
                    extracurricular=data.extracurricular,
                    gender=data.gender,
                    math=data.math,
                    science=data.science,
                    english=data.english,
                    computer=data.computer,
                )
            except Exception:
                advice_text = None

        result_data = {
            "prediction": pred,
            "shap":       shap_r,
            "careers":    careers,
            "advice":     advice_text,
        }

        # Auto-save to MongoDB (non-blocking — ignore if DB unavailable)
        try:
            doc_id = save_student_analysis(data.model_dump(), result_data, user_id=user_id)
            result_data["history_id"] = doc_id
        except Exception:
            pass

        return {"success": True, "data": result_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── History Endpoints ─────────────────────────────────────────────────────────

@app.get("/history")
def history(limit: int = 20, user_id: str | None = Depends(_get_user_id)):
    """Fetch latest student analyses for the History page."""
    try:
        return {"success": True, "data": get_history(limit, user_id=user_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history/{doc_id}")
def history_detail(doc_id: str):
    """Fetch a single analysis by ID — for 'View Details' button."""
    try:
        doc = get_analysis_by_id(doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Analysis not found")
        return {"success": True, "data": doc}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/similar")
def similar(data: StudentInput, user_id: str | None = Depends(_get_user_id)):
    """
    Vector search — find past students with similar academic profiles.
    Uses MongoDB Atlas $vectorSearch if index exists, else cosine fallback.
    """
    try:
        results = find_similar_students(
            data.model_dump(),
            exclude_user_id=user_id,
            limit=3,
        )
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stats")
def stats(user_id: str | None = Depends(_get_user_id)):
    """Aggregate stats — total analyses, average grade, pass rate."""
    try:
        return {"success": True, "data": get_stats(user_id=user_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── TTS Endpoint ──────────────────────────────────────────────────────────────

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=6000)


@app.post("/tts")
def tts(data: TTSRequest):
    """
    Convert AI advice text to speech using Uplift Orator Studio API.
    Returns MP3 audio — frontend plays it directly in the audio player.
    """
    try:
        # Truncate server-side as safety net
        safe_text  = data.text.strip()[:500]
        audio_bytes = text_to_speech(safe_text)
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=advice.mp3"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
