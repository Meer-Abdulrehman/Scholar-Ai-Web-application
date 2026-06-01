import os
import json
import numpy as np
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")
import joblib

# Try to load a trained career classifier if present
_MODEL_DIR = Path(__file__).parent.parent / "models"
_CAREER_MODEL = None
_CAREER_LE = None
_CAREER_CLASSES = None
if (_MODEL_DIR / "career_clf.pkl").exists():
    try:
        _CAREER_MODEL = joblib.load(_MODEL_DIR / "career_clf.pkl")
        _CAREER_LE = joblib.load(_MODEL_DIR / "career_label_encoder.pkl")
        try:
            with open(_MODEL_DIR / "career_classes.json", "r", encoding="utf-8") as f:
                _CAREER_CLASSES = json.load(f)
        except Exception:
            _CAREER_CLASSES = None
        print("[INFO] Loaded trained career classifier.")
    except Exception as exc:
        print(f"[WARNING] Failed to load career classifier: {exc}")


def _llm_careers(math: float, science: float, english: float, last_subj_value: float,
                 last_subj_name: str, track: str,
                 avg_grade: float, status: str, level: str, top_n: int) -> list:
    """Use Groq LLM to dynamically generate career recommendations."""
    client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))
    # If the student is on pre-medical track, instruct the LLM to return only medical/healthcare careers.
    med_instruction = """
If the student is on a Pre-Medical track (biology), return ONLY medical and healthcare related careers
such as Doctor, Dentist, Nurse, Pharmacist, Physiotherapist, Medical Laboratory Scientist,
Biotechnologist, Public Health Specialist, D-Pharmacy, etc. Do NOT recommend non-medical careers.
""" if track == 'pre-medical' else ""

    prompt = f"""You are a career counselor AI. Based on a student's academic profile, recommend the top {top_n} most suitable career paths.

Student Profile:
- Math grade: {math}/100
- Science grade: {science}/100
- English grade: {english}/100
- {last_subj_name} grade: {last_subj_value}/100
- Predicted overall grade: {avg_grade}%
- Academic status: {status}
- Performance level: {level}

Instructions:
- Analyze the student's strongest and weakest subjects
- Recommend careers that align with their subject strengths
- Consider their overall performance level
- Be specific and realistic
- Each career must have a match percentage (0-100) based on how well their grades fit that field

{med_instruction}

Respond ONLY with a valid JSON array, no extra text:
[
    {{"rank": 1, "name": "Career Name", "match": 95, "reason": "One sentence why this fits"}},
    {{"rank": 2, "name": "Career Name", "match": 88, "reason": "One sentence why this fits"}},
    {{"rank": 3, "name": "Career Name", "match": 79, "reason": "One sentence why this fits"}}
]"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=400,
    )

    raw = response.choices[0].message.content.strip()

    # Extract JSON array from response
    start = raw.find('[')
    end   = raw.rfind(']') + 1
    if start == -1 or end == 0:
        raise ValueError("No JSON array in LLM response")

    careers = json.loads(raw[start:end])

    medals = ["🥇", "🥈", "🥉"]
    result = []
    for i, c in enumerate(careers[:top_n]):
        result.append({
            "rank":   i + 1,
            "medal":  medals[i] if i < 3 else "",
            "name":   c.get("name", "Unknown"),
            "match":  float(c.get("match", 0)),
            "reason": c.get("reason", ""),
            "icon":   "🎓",
        })
    return result


# Fallback — used when GROQ_API_KEY is missing
_FALLBACK_CAREERS_ENGINEERING = [
    {"name": "Software Engineer",     "profile": [70, 65, 60, 90], "icon": "💻"},
    {"name": "Data Scientist",        "profile": [85, 75, 60, 85], "icon": "📊"},
    {"name": "Business Analyst",      "profile": [80, 60, 80, 75], "icon": "📈"},
    {"name": "Mechanical Engineer",   "profile": [90, 85, 55, 65], "icon": "⚙️"},
    {"name": "Graphic Designer",      "profile": [55, 50, 70, 80], "icon": "🎨"},
    {"name": "Journalist / Writer",   "profile": [55, 55, 95, 50], "icon": "✍️"},
    {"name": "Accountant / Finance",  "profile": [90, 60, 70, 65], "icon": "💰"},
    {"name": "Cybersecurity Analyst", "profile": [70, 65, 60, 95], "icon": "🔐"},
]

_FALLBACK_CAREERS_MEDICAL = [
    {"name": "Doctor",                "profile": [75, 95, 65, 95], "icon": "🏥"},
    {"name": "Pharmacist",            "profile": [65, 90, 70, 85], "icon": "💊"},
    {"name": "Medical Laboratory Scientist", "profile": [70, 90, 65, 80], "icon": "🔬"},
    {"name": "Public Health Specialist",     "profile": [70, 85, 75, 70], "icon": "🌍"},
    {"name": "Nurse",                 "profile": [60, 88, 70, 75], "icon": "💉"},
    {"name": "Biotechnologist",       "profile": [80, 85, 65, 85], "icon": "🧬"},
]

def _cosine_careers(math: float, science: float, english: float, last_subj: float,
                    fallback_profiles: list, top_n: int) -> list:
    student  = np.array([math, science, english, last_subj])
    profiles = np.array([c["profile"] for c in fallback_profiles], dtype=float)
    sims = []
    for i, profile in enumerate(profiles):
        dot  = np.dot(student, profile)
        norm = np.linalg.norm(student) * np.linalg.norm(profile)
        sims.append((i, round((dot / norm) * 100, 1) if norm > 0 else 0.0))
    sims.sort(key=lambda x: x[1], reverse=True)
    medals = ["🥇", "🥈", "🥉"]
    return [
        {
            "rank":   rank + 1,
            "medal":  medals[rank] if rank < 3 else "",
            "name":   fallback_profiles[idx]["name"],
            "icon":   fallback_profiles[idx]["icon"],
            "match":  score,
            "reason": "",
        }
        for rank, (idx, score) in enumerate(sims[:top_n])
    ]


def _model_careers(math: float, science: float, english: float, last_subj: float, top_n: int) -> list:
    """Use a trained classifier (if available) to predict career probabilities."""
    if _CAREER_MODEL is None or _CAREER_LE is None:
        raise RuntimeError("No trained career model available")

    X = np.array([[math, science, english, last_subj]], dtype=float)
    probs = _CAREER_MODEL.predict_proba(X)[0]
    # get top indices
    idxs = np.argsort(probs)[::-1][:top_n]
    medals = ["🥇", "🥈", "🥉"]
    results = []
    for rank, idx in enumerate(idxs):
        name = _CAREER_LE.inverse_transform([idx])[0] if hasattr(_CAREER_LE, 'inverse_transform') else (_CAREER_CLASSES[idx] if _CAREER_CLASSES else str(idx))
        results.append({
            "rank": rank + 1,
            "medal": medals[rank] if rank < 3 else "",
            "name": name,
            "icon": "🏥" if "doctor" in name.lower() or "nurse" in name.lower() or "pharm" in name.lower() or "dent" in name.lower() else "🎓",
            "match": round(float(probs[idx]) * 100, 1),
            "reason": "Predicted by trained career classifier",
        })
    return results


def _filter_medical(careers: list) -> list:
    """Return only careers that look medical/healthcare-related by keyword matching."""
    medical_keywords = [
        'doctor','dentist','nurse','pharm','pharmacy','physio','physiotherapist',
        'medical','lab','laboratory','biotech','biotechnologist','surgeon','therapist'
    ]
    filtered = []
    for c in careers:
        name = c.get('name','').lower()
        if any(k in name for k in medical_keywords):
            filtered.append(c)
    return filtered


def _pre_medical_rule_careers(bio_score: float, top_n: int) -> list:
    """Deterministic mapping from Biology score ranges to medical career suggestions.

    Rules (as requested):
    - bio < 50 : lower-tier healthcare roles (assistants, technicians)
    - 50 <= bio < 80 : mid-tier healthcare careers (lab scientist, nurse)
    - 80 <= bio < 90 : D-Pharmacy and allied health professions
    - 90 <= bio <= 98 : MBBS / Doctor, Dentist (high-merit medical careers)
    """
    bio = float(bio_score or 0)
    results = []
    medals = ["🥇", "🥈", "🥉"]

    if bio < 50:
        pool = [
            ("Health Assistant", "Suitable for students with lower Biology marks; consider vocational health roles."),
            ("Laboratory Technician", "Entry-level lab work; requires practical training."),
            ("Nursing Assistant", "Support role in nursing with certificate courses."),
        ]
        base = 45
    elif bio < 80:
        pool = [
            ("Medical Laboratory Scientist", "Good science foundation — suitable for lab science careers."),
            ("Nurse", "Strong Biology and Science support nursing career paths."),
            ("Physiotherapist Assistant", "Allied health role supporting physiotherapy."),
        ]
        base = 70
    elif bio < 90:
        pool = [
            ("D-Pharmacy", "Direct-entry pharmacy diploma suits strong Biology students."),
            ("Pharmacy Technician", "Clinical pharmacy support roles."),
            ("Allied Health Professional", "Higher merit allied health disciplines."),
        ]
        base = 82
    else:
        # 90 - 98 -> MBBS and high-merit medical careers
        pool = [
            ("MBBS (Doctor)", "Top-tier medical program — requires high merit."),
            ("Dentist (BDS)", "High merit dentistry pathway."),
            ("Physician / Specialist Path", "Path toward clinical specialisation after MBBS."),
        ]
        base = 92

    for i, (name, reason) in enumerate(pool[:top_n]):
        # Match score scaled from base toward bio (cap 99)
        match = min(99, round(base + (bio - base) * 0.6, 1))
        results.append({
            "rank": i + 1,
            "medal": medals[i] if i < 3 else "",
            "name": name,
            "icon": "🏥",
            "match": match,
            "reason": reason,
        })

    return results


def recommend_careers(
    math: float, science: float, english: float, computer: float,
    biology: float | None = None,
    track: str = 'pre-engineering',
    top_n: int = 3,
    avg_grade: float = None,
    status: str = None,
    level: str = None,
) -> list:
    """
    Recommend top careers.
    - If GROQ_API_KEY is set: uses LLM for dynamic, personalized recommendations
    - Otherwise: falls back to cosine similarity on predefined career profiles
    """
    # Choose which last subject to use (computer vs biology)
    if biology is not None:
        last_val = biology
        last_name = "Biology"
    else:
        last_val = computer
        last_name = "Computer Science"

    # If a trained model exists, use it first (data-driven)
    try:
        if track == 'pre-medical':
            # Apply deterministic rule-based mapping first (explicit merit rules)
            try:
                return _pre_medical_rule_careers(last_val, top_n)
            except Exception:
                pass

        if _CAREER_MODEL is not None:
            careers = _model_careers(math, science, english, last_val, top_n)
            # If pre-medical, filter to medical careers
            if track == 'pre-medical':
                filtered = _filter_medical(careers)
                if len(filtered) >= top_n:
                    return filtered[:top_n]
                # otherwise supplement from medical fallbacks
                supplement = _cosine_careers(math, science, english, last_val, _FALLBACK_CAREERS_MEDICAL, top_n)
                combined = filtered + [c for c in supplement if c['name'] not in {x['name'] for x in filtered}]
                return combined[:top_n]
            return careers
    except Exception as exc:
        print(f"[WARNING] Trained career model failed, falling back: {exc}")

    if os.getenv("GROQ_API_KEY") and avg_grade is not None:
        try:
            careers = _llm_careers(math, science, english, last_val, last_name, track,
                                avg_grade, status or "Unknown", level or "Unknown", top_n)
            if track == 'pre-medical':
                filtered = _filter_medical(careers)
                if len(filtered) >= top_n:
                    return filtered[:top_n]
                supplement = _cosine_careers(math, science, english, last_val, _FALLBACK_CAREERS_MEDICAL, top_n)
                combined = filtered + [c for c in supplement if c['name'] not in {x['name'] for x in filtered}]
                return combined[:top_n]
            return careers
        except Exception as exc:
            print(f"[WARNING] LLM career recommendation failed, using fallback: {exc}")

    # Fallback: select appropriate fallback profiles based on track
    # Fallback: select appropriate fallback profiles based on track
    if track == 'pre-medical':
        fallback = _FALLBACK_CAREERS_MEDICAL
    else:
        fallback = _FALLBACK_CAREERS_ENGINEERING

    # If pre-medical, ensure results are medical-only
    results = _cosine_careers(math, science, english, last_val, fallback, top_n)
    if track == 'pre-medical':
        return results
    return results
