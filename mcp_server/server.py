"""
AI Student Advisor — MCP Server
================================
Exposes 3 tools that any MCP-compatible AI client (Claude, Cursor, etc.)
can call in natural language:

  1. predict_grade        — predict final grade + Pass/Fail
  2. recommend_career     — top 3 career matches from subject grades
  3. explain_performance  — SHAP-based explanation of the predicted grade
  4. career_grade_guidance — required grade guidance + alternate careers from DB

Run:
    cd mcp_server
    python server.py
"""

import sys
import json
from pathlib import Path

# Allow importing backend services regardless of working directory
sys.path.insert(0, str(Path(__file__).parent.parent))

from mcp.server.fastmcp import FastMCP
from backend.services.prediction import predict_grade, explain_performance
from backend.services.career import recommend_careers
from backend.vector_db.db import get_career_grade_guidance

# ── Server instance ───────────────────────────────────────────────────────────

mcp = FastMCP(
    name="AI Student Advisor",
    instructions=(
        "You are an academic advisor AI. "
        "Use the available tools to predict student grades, "
        "explain what is driving the prediction, "
        "and recommend suitable career paths."
    ),
)


# ── Tool 1 — predict_grade ────────────────────────────────────────────────────

@mcp.tool(
    name="predict_grade",
    description=(
        "Predict a student's final grade percentage and Pass/Fail status "
        "using Random Forest and Linear Regression models. "
        "Returns RF grade, LR grade, averaged grade, status, and performance level."
    ),
)
def tool_predict_grade(
    study_hours: float,
    attendance: float,
    prev_grade: float,
    sleep_hours: float,
    extracurricular: int,
    gender: int,
) -> str:
    """
    Parameters
    ----------
    study_hours     : Hours spent studying per day (0–24)
    attendance      : Class attendance percentage (0–100)
    prev_grade      : Previous semester grade percentage (0–100)
    sleep_hours     : Sleep hours per day (0–24)
    extracurricular : Participates in extracurricular activities (1=Yes, 0=No)
    gender          : Student gender (1=Male, 0=Female)
    """
    result = predict_grade(
        study_hours, attendance, prev_grade,
        sleep_hours, extracurricular, gender,
    )

    lines = [
        "📊 Grade Prediction Result",
        "─" * 35,
        f"  Random Forest Grade : {result['grade_rf']}%",
        f"  Linear Regression   : {result['grade_lr']}%",
        f"  Average Grade       : {result['avg_grade']}%",
        f"  Status              : {'✅ PASS' if result['status'] == 'Pass' else '❌ FAIL'}",
        f"  Performance Level   : {result['level']}",
    ]
    return "\n".join(lines)


# ── Tool 2 — recommend_career ─────────────────────────────────────────────────

@mcp.tool(
    name="recommend_career",
    description=(
        "Recommend the top 3 career paths for a student based on their subject "
        "grades in Math, Science, English, and Computer Science. "
        "Uses cosine similarity against career profiles."
    ),
)
def tool_recommend_career(
    math: float,
    science: float,
    english: float,
    computer: float,
) -> str:
    """
    Parameters
    ----------
    math     : Math grade percentage (0–100)
    science  : Science grade percentage (0–100)
    english  : English grade percentage (0–100)
    computer : Computer Science grade percentage (0–100)
    """
    careers = recommend_careers(math, science, english, computer)

    lines = ["🎯 Top Career Recommendations", "─" * 35]
    for c in careers:
        bar_filled = int(c["match"] / 5)
        bar        = "█" * bar_filled + "░" * (20 - bar_filled)
        lines.append(f"  {c['medal']} {c['name']}")
        lines.append(f"     {bar}  {c['match']}% match")
        lines.append("")

    return "\n".join(lines)


# ── Tool 3 — explain_performance ─────────────────────────────────────────────

@mcp.tool(
    name="explain_performance",
    description=(
        "Explain why a student received their predicted grade using SHAP "
        "(SHapley Additive exPlanations). Returns the base grade, each "
        "feature's contribution (positive = helps grade, negative = hurts grade), "
        "and the final predicted grade."
    ),
)
def tool_explain_performance(
    study_hours: float,
    attendance: float,
    prev_grade: float,
    sleep_hours: float,
    extracurricular: int,
    gender: int,
) -> str:
    """
    Parameters
    ----------
    study_hours     : Hours spent studying per day (0–24)
    attendance      : Class attendance percentage (0–100)
    prev_grade      : Previous semester grade percentage (0–100)
    sleep_hours     : Sleep hours per day (0–24)
    extracurricular : Participates in extracurricular activities (1=Yes, 0=No)
    gender          : Student gender (1=Male, 0=Female)
    """
    result = explain_performance(
        study_hours, attendance, prev_grade,
        sleep_hours, extracurricular, gender,
    )

    lines = [
        "🔍 SHAP Performance Explanation",
        "─" * 38,
        f"  Base Grade (average student) : {result['base_value']}%",
        f"  Your Predicted Grade         : {result['predicted']}%",
        "",
        "  Feature Contributions:",
        "  (+ means it pushed your grade UP, - means DOWN)",
        "",
    ]

    for item in result["contributions"]:
        val    = item["shap_value"]
        sign   = "+" if val >= 0 else ""
        arrow  = "▲" if val >= 0 else "▼"
        color  = "✅" if val >= 0 else "⚠️"
        lines.append(
            f"  {color} {item['feature']:<18} {arrow} {sign}{val}"
        )

    lines += [
        "",
        f"  Base {result['base_value']}% + contributions = {result['predicted']}%",
    ]
    return "\n".join(lines)


# ── Tool 4 — career_grade_guidance ───────────────────────────────────────────

@mcp.tool(
    name="career_grade_guidance",
    description=(
        "Find grade requirements for a target career using historical student "
        "analyses from the vector database. Returns a recommended grade target, "
        "best matching past profiles, and top alternate careers."
    ),
)
def tool_career_grade_guidance(
    target_career: str,
    top_examples: int = 3,
) -> str:
    """
    Parameters
    ----------
    target_career : Desired field/career (e.g., Data Analyst, Software Engineer)
    top_examples  : Number of best past matches to show (1-10)
    """
    top_examples = max(1, min(int(top_examples), 10))
    result = get_career_grade_guidance(target_career=target_career, limit=top_examples)

    if result["count"] == 0:
        return (
            "🎯 Career Grade Guidance\n"
            + "─" * 35 + "\n"
            + f"  Target Career : {target_career}\n"
            + "  No historical matches found in database.\n"
            + "  Tip: run more student analyses first, then try again."
        )

    stats = result.get("grade_stats", {})
    lines = [
        "🎯 Career Grade Guidance",
        "─" * 35,
        f"  Target Career        : {result['career']}",
        f"  Historical Matches   : {result['count']}",
        f"  Recommended Grade    : {result.get('required_grade')}% (target for strong chance)",
        f"  Observed Grade Range : {stats.get('min')}% - {stats.get('max')}%",
        f"  Cohort Average Grade : {stats.get('avg')}%",
        f"  Pass Students Avg    : {stats.get('pass_avg')}%",
        "",
        "  Best Similar Profiles:",
    ]

    for i, item in enumerate(result.get("best_matches", []), 1):
        lines.append(
            f"  {i}. {item.get('career')} | grade {item.get('avg_grade')}% | "
            f"{item.get('status')} | match {item.get('match')}%"
        )

    alts = result.get("alternate_careers", [])
    if alts:
        lines.append("")
        lines.append("  Alternate Career Suggestions:")
        for i, alt in enumerate(alts, 1):
            lines.append(
                f"  {i}. {alt['name']} (seen {alt['frequency']} times, avg match {alt['avg_match']}%)"
            )

    return "\n".join(lines)


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mcp.run(transport="stdio")
