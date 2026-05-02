"""
MongoDB Atlas — Database Layer
================================
Collections:
  student_advisor.students  — every /analyze request saved here (with embedding)

Vector Search:
  Each student document stores a 10-dim normalized embedding.
  Atlas Vector Search index "student_vector_index" enables semantic similarity search.
  Fallback: if index not set up, cosine similarity computed in Python.
"""

import sys
import math
from pathlib import Path
from datetime import datetime, timezone
from bson import ObjectId

sys.path.insert(0, str(Path(__file__).parent.parent))
from config.db import get_db


# ── Embedding helpers ─────────────────────────────────────────────────────────

def _build_embedding(input_data: dict) -> list[float]:
    """
    Convert student input into a normalized 10-dim vector for vector search.
    Each dimension is scaled to [0, 1].
    """
    return [
        float(input_data.get("study_hours",     0)) / 24.0,
        float(input_data.get("attendance",       0)) / 100.0,
        float(input_data.get("prev_grade",       0)) / 100.0,
        float(input_data.get("sleep_hours",      0)) / 24.0,
        float(input_data.get("extracurricular",  0)),
        float(input_data.get("gender",           0)),
        float(input_data.get("math",             0)) / 100.0,
        float(input_data.get("science",          0)) / 100.0,
        float(input_data.get("english",          0)) / 100.0,
        float(input_data.get("computer",         0)) / 100.0,
    ]


def _cosine(a: list[float], b: list[float]) -> float:
    dot  = sum(x * y for x, y in zip(a, b))
    na   = math.sqrt(sum(x * x for x in a))
    nb   = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb) if na * nb > 0 else 0.0


# ── Save ──────────────────────────────────────────────────────────────────────

def save_student_analysis(input_data: dict, results: dict, user_id: str = None) -> str:
    """
    Save analysis + 10-dim embedding to the students collection.
    Returns inserted document ID as string.
    """
    db        = get_db()
    embedding = _build_embedding(input_data)

    doc = {
        "created_at": datetime.now(timezone.utc),
        "user_id":    user_id,
        "embedding":  embedding,
        "input": {
            "study_hours":     input_data.get("study_hours"),
            "attendance":      input_data.get("attendance"),
            "prev_grade":      input_data.get("prev_grade"),
            "sleep_hours":     input_data.get("sleep_hours"),
            "extracurricular": input_data.get("extracurricular"),
            "gender":          input_data.get("gender"),
            "math":            input_data.get("math"),
            "science":         input_data.get("science"),
            "english":         input_data.get("english"),
            "computer":        input_data.get("computer"),
        },
        "results": {
            "avg_grade":  results.get("prediction", {}).get("avg_grade"),
            "status":     results.get("prediction", {}).get("status"),
            "level":      results.get("prediction", {}).get("level"),
            "top_career": (results.get("careers") or [{}])[0].get("name"),
            "careers":    results.get("careers", []),
            "shap":       results.get("shap", {}),
            "advice":     results.get("advice"),
        },
    }
    result = db["students"].insert_one(doc)
    return str(result.inserted_id)


# ── Vector Search ─────────────────────────────────────────────────────────────

def find_similar_students(
    input_data: dict,
    exclude_user_id: str = None,
    limit: int = 3,
) -> list:
    """
    Find past students with similar profiles using vector search.

    Tries MongoDB Atlas $vectorSearch first (requires index "student_vector_index").
    Falls back to in-memory cosine similarity if index is unavailable.
    """
    db        = get_db()
    embedding = _build_embedding(input_data)

    # ── Try Atlas Vector Search ───────────────────────────────────────────────
    try:
        pipeline = [
            {
                "$vectorSearch": {
                    "index":        "student_vector_index",
                    "path":         "embedding",
                    "queryVector":  embedding,
                    "numCandidates": max(limit * 10, 50),
                    "limit":        limit + 5,  # fetch extra to filter self/same user
                }
            },
            {
                "$project": {
                    "_id":                  1,
                    "user_id":              1,
                    "created_at":           1,
                    "input":                1,
                    "results.avg_grade":    1,
                    "results.status":       1,
                    "results.level":        1,
                    "results.top_career":   1,
                    "score": {"$meta": "vectorSearchScore"},
                }
            },
        ]
        docs = list(db["students"].aggregate(pipeline))
        # Filter out current user's own analyses
        if exclude_user_id:
            docs = [d for d in docs if str(d.get("user_id", "")) != str(exclude_user_id)]
        docs = docs[:limit]

        if docs:
            return _format_similar(docs, use_score_field=True)

    except Exception:
        pass  # Index not set up — use fallback

    # ── Fallback: in-memory cosine similarity ─────────────────────────────────
    query  = {} if not exclude_user_id else {"user_id": {"$ne": exclude_user_id}}
    cursor = db["students"].find(
        query,
        {"_id": 1, "user_id": 1, "created_at": 1, "embedding": 1,
         "input": 1, "results.avg_grade": 1, "results.status": 1,
         "results.level": 1, "results.top_career": 1}
    ).limit(200)

    scored = []
    for doc in cursor:
        emb = doc.get("embedding")
        if not emb or len(emb) != 10:
            continue
        score = _cosine(embedding, emb)
        scored.append((score, doc))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_docs = [doc for _, doc in scored[:limit]]

    return _format_similar(top_docs, use_score_field=False,
                           scores=[s for s, _ in scored[:limit]])


def _format_similar(docs: list, use_score_field: bool, scores: list = None) -> list:
    result = []
    for i, doc in enumerate(docs):
        score = doc.get("score", scores[i] if scores else 0) if use_score_field else (scores[i] if scores else 0)
        result.append({
            "id":         str(doc["_id"]),
            "created_at": doc["created_at"].strftime("%d %b %Y") if hasattr(doc.get("created_at"), "strftime") else str(doc.get("created_at", "")),
            "similarity": round(float(score) * 100, 1),
            "avg_grade":  doc.get("results", {}).get("avg_grade"),
            "status":     doc.get("results", {}).get("status"),
            "level":      doc.get("results", {}).get("level"),
            "top_career": doc.get("results", {}).get("top_career"),
            "study_hours":    doc.get("input", {}).get("study_hours"),
            "attendance":     doc.get("input", {}).get("attendance"),
            "prev_grade":     doc.get("input", {}).get("prev_grade"),
        })
    return result


# ── History ───────────────────────────────────────────────────────────────────

def get_history(limit: int = 20, user_id: str = None) -> list:
    """Fetch latest student analyses — newest first."""
    db     = get_db()
    query  = {"user_id": user_id} if user_id else {}
    cursor = db["students"].find(
        query,
        {"_id": 1, "created_at": 1, "results.avg_grade": 1,
         "results.status": 1, "results.top_career": 1,
         "results.level": 1, "input": 1, "results.careers": 1,
         "results.shap": 1, "results.advice": 1}
    ).sort("created_at", -1).limit(limit)

    history = []
    for i, doc in enumerate(cursor):
        history.append({
            "id":         str(doc["_id"]),
            "index":      i + 1,
            "created_at": doc["created_at"].strftime("%d %b %Y, %I:%M %p"),
            "avg_grade":  doc.get("results", {}).get("avg_grade"),
            "status":     doc.get("results", {}).get("status"),
            "level":      doc.get("results", {}).get("level"),
            "top_career": doc.get("results", {}).get("top_career"),
            "input":      doc.get("input", {}),
            "careers":    doc.get("results", {}).get("careers", []),
            "shap":       doc.get("results", {}).get("shap", {}),
            "advice":     doc.get("results", {}).get("advice"),
        })
    return history


def get_analysis_by_id(doc_id: str) -> dict | None:
    """Fetch a single analysis by its MongoDB _id."""
    db  = get_db()
    doc = db["students"].find_one({"_id": ObjectId(doc_id)})
    if not doc:
        return None
    doc["_id"]        = str(doc["_id"])
    doc["created_at"] = doc["created_at"].strftime("%d %b %Y, %I:%M %p")
    return doc


def get_stats(user_id: str = None) -> dict:
    """Aggregate stats — total analyses, average grade, pass rate."""
    db       = get_db()
    match    = {"$match": {"user_id": user_id}} if user_id else {"$match": {}}
    pipeline = [
        match,
        {"$group": {
            "_id":        None,
            "total":      {"$sum": 1},
            "avg_grade":  {"$avg": "$results.avg_grade"},
            "pass_count": {"$sum": {"$cond": [{"$eq": ["$results.status", "Pass"]}, 1, 0]}},
        }}
    ]
    result = list(db["students"].aggregate(pipeline))
    if not result:
        return {"total": 0, "avg_grade": 0, "pass_rate": 0}
    r     = result[0]
    total = r["total"]
    return {
        "total":     total,
        "avg_grade": round(r["avg_grade"], 1),
        "pass_rate": round((r["pass_count"] / total) * 100, 1) if total else 0,
    }
