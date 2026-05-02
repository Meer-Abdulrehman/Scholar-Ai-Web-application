"""
AI Student Advisor — MCP Server
================================
Exposes 3 tools that any MCP-compatible AI client (Claude, Cursor, etc.)
can call in natural language:

  1. predict_grade        — predict final grade + Pass/Fail
  2. recommend_career     — top 3 career matches from subject grades
  3. explain_performance  — SHAP-based explanation of the predicted grade

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


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mcp.run(transport="stdio")
