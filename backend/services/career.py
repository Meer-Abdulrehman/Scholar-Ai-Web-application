import os
import json
import numpy as np
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")


def _llm_careers(math: float, science: float, english: float, computer: float,
                 avg_grade: float, status: str, level: str, top_n: int) -> list:
    """Use Groq LLM to dynamically generate career recommendations."""
    client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

    prompt = f"""You are a career counselor AI. Based on a student's academic profile, recommend the top {top_n} most suitable career paths.

Student Profile:
- Math grade: {math}/100
- Science grade: {science}/100
- English grade: {english}/100
- Computer Science grade: {computer}/100
- Predicted overall grade: {avg_grade}%
- Academic status: {status}
- Performance level: {level}

Instructions:
- Analyze the student's strongest and weakest subjects
- Recommend careers that align with their subject strengths
- Consider their overall performance level
- Be specific and realistic
- Each career must have a match percentage (0-100) based on how well their grades fit that field

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
_FALLBACK_CAREERS = [
    {"name": "Software Engineer",     "profile": [70, 65, 60, 90], "icon": "💻"},
    {"name": "Data Scientist",        "profile": [85, 75, 60, 85], "icon": "📊"},
    {"name": "Doctor",                "profile": [75, 95, 65, 55], "icon": "🏥"},
    {"name": "Business Analyst",      "profile": [80, 60, 80, 75], "icon": "📈"},
    {"name": "Teacher / Educator",    "profile": [65, 65, 90, 60], "icon": "📚"},
    {"name": "Mechanical Engineer",   "profile": [90, 85, 55, 65], "icon": "⚙️"},
    {"name": "Graphic Designer",      "profile": [55, 50, 70, 80], "icon": "🎨"},
    {"name": "Journalist / Writer",   "profile": [55, 55, 95, 50], "icon": "✍️"},
    {"name": "Accountant / Finance",  "profile": [90, 60, 70, 65], "icon": "💰"},
    {"name": "Cybersecurity Analyst", "profile": [70, 65, 60, 95], "icon": "🔐"},
]

def _cosine_careers(math: float, science: float, english: float, computer: float,
                    top_n: int) -> list:
    student  = np.array([math, science, english, computer])
    profiles = np.array([c["profile"] for c in _FALLBACK_CAREERS], dtype=float)
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
            "name":   _FALLBACK_CAREERS[idx]["name"],
            "icon":   _FALLBACK_CAREERS[idx]["icon"],
            "match":  score,
            "reason": "",
        }
        for rank, (idx, score) in enumerate(sims[:top_n])
    ]


def recommend_careers(
    math: float, science: float, english: float, computer: float,
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
    if os.getenv("GROQ_API_KEY") and avg_grade is not None:
        try:
            return _llm_careers(math, science, english, computer,
                                avg_grade, status or "Unknown", level or "Unknown", top_n)
        except Exception as exc:
            print(f"[WARNING] LLM career recommendation failed, using fallback: {exc}")

    return _cosine_careers(math, science, english, computer, top_n)
