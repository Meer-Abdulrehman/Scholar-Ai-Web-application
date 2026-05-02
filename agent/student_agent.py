"""
AI Student Advisor — LangChain Agent
======================================
A ReAct agent powered by Groq (llama3-8b-8192) that uses 3 tools:

  - predict_grade        : predict final grade + Pass/Fail
  - recommend_career     : top 3 career matches
  - explain_performance  : SHAP-based explanation

The agent reasons step-by-step (Thought → Action → Observation)
and decides on its own which tools to call based on the user's question.

Usage:
    from agent.student_agent import run_agent
    response = run_agent("Predict grade for a student with 5 study hours,
                          90% attendance, 75 prev grade, 7 sleep hours,
                          extracurricular yes, male")
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).parent.parent / "backend" / ".env")

from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.prebuilt import create_react_agent

from backend.services.prediction import predict_grade, explain_performance
from backend.services.career import recommend_careers


# ── LangChain Tools ───────────────────────────────────────────────────────────

@tool
def tool_predict_grade(
    study_hours: float,
    attendance: float,
    prev_grade: float,
    sleep_hours: float,
    extracurricular: int,
    gender: int,
) -> str:
    """
    Predict a student's final grade percentage and Pass/Fail status.

    Args:
        study_hours: Hours spent studying per day (0-24)
        attendance: Class attendance percentage (0-100)
        prev_grade: Previous semester grade percentage (0-100)
        sleep_hours: Sleep hours per day (0-24)
        extracurricular: Extracurricular activities (1=Yes, 0=No)
        gender: Student gender (1=Male, 0=Female)
    """
    result = predict_grade(
        study_hours, attendance, prev_grade,
        sleep_hours, extracurricular, gender,
    )
    return (
        f"Predicted Grade: {result['avg_grade']}% "
        f"(RF: {result['grade_rf']}%, LR: {result['grade_lr']}%) | "
        f"Status: {result['status']} | "
        f"Performance Level: {result['level']}"
    )


@tool
def tool_recommend_career(
    math: float,
    science: float,
    english: float,
    computer: float,
) -> str:
    """
    Recommend top 3 career paths based on a student's subject grades.

    Args:
        math: Math grade percentage (0-100)
        science: Science grade percentage (0-100)
        english: English grade percentage (0-100)
        computer: Computer Science grade percentage (0-100)
    """
    careers = recommend_careers(math, science, english, computer,
                                avg_grade=None, status=None, level=None)
    lines = []
    for c in careers:
        lines.append(f"Rank {c['rank']}: {c['name']} — {c['match']}% match")
    return "\n".join(lines)


@tool
def tool_explain_performance(
    study_hours: float,
    attendance: float,
    prev_grade: float,
    sleep_hours: float,
    extracurricular: int,
    gender: int,
) -> str:
    """
    Explain why a student received their predicted grade using SHAP values.
    Shows which features helped (positive) or hurt (negative) the grade.

    Args:
        study_hours: Hours spent studying per day (0-24)
        attendance: Class attendance percentage (0-100)
        prev_grade: Previous semester grade percentage (0-100)
        sleep_hours: Sleep hours per day (0-24)
        extracurricular: Extracurricular activities (1=Yes, 0=No)
        gender: Student gender (1=Male, 0=Female)
    """
    result = explain_performance(
        study_hours, attendance, prev_grade,
        sleep_hours, extracurricular, gender,
    )
    lines = [
        f"Base Grade: {result['base_value']}%",
        f"Predicted Grade: {result['predicted']}%",
        "Feature Contributions (SHAP):",
    ]
    for item in result["contributions"]:
        sign = "+" if item["shap_value"] >= 0 else ""
        lines.append(f"  {item['feature']}: {sign}{item['shap_value']}")
    return "\n".join(lines)


# ── Agent Factory ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert AI academic advisor for students.

You have access to 3 tools:
1. tool_predict_grade       — predict final grade and pass/fail status
2. tool_recommend_career    — suggest top 3 career paths
3. tool_explain_performance — explain why the grade was predicted using SHAP

When a user provides student data, use the appropriate tools to analyze the
student's performance. Always:
- Use tool_predict_grade first to get the grade
- Use tool_explain_performance to understand what is driving the grade
- Use tool_recommend_career when subject grades are provided
- Combine all results into a clear, encouraging, personalized response
- Give 1-2 actionable improvement tips based on SHAP insights

Be warm, supportive, and specific in your final advice."""


def build_agent():
    """Create and return the ReAct agent."""
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise ValueError(
            "GROQ_API_KEY not found. "
            "Add it to backend/.env: GROQ_API_KEY=gsk_xxx"
        )

    llm = ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=api_key,
        temperature=0.3,
        max_tokens=1024,
    )

    tools = [
        tool_predict_grade,
        tool_recommend_career,
        tool_explain_performance,
    ]

    agent = create_react_agent(
        model=llm,
        tools=tools,
        prompt=SYSTEM_PROMPT,
    )
    return agent


# ── Public API ────────────────────────────────────────────────────────────────

_agent = None


def run_agent(user_message: str) -> str:
    """
    Run the agent with a natural language message.
    Returns the agent's final text response.

    Example:
        run_agent(
            "Student: 5 study hours, 90% attendance, 75 prev grade, "
            "7 sleep hours, extracurricular yes, male. "
            "Subjects: Math 85, Science 70, English 60, Computer 90. "
            "Analyze his performance."
        )
    """
    global _agent
    if _agent is None:
        _agent = build_agent()

    result = _agent.invoke(
        {"messages": [HumanMessage(content=user_message)]}
    )

    # Extract final AI message
    messages = result.get("messages", [])
    for msg in reversed(messages):
        if hasattr(msg, "content") and msg.content:
            # Skip tool call messages
            if not getattr(msg, "tool_calls", None):
                return msg.content

    return "No response generated."


# ── FastAPI-compatible function ───────────────────────────────────────────────

def get_agent_advice(
    study_hours: float,
    attendance: float,
    prev_grade: float,
    sleep_hours: float,
    extracurricular: int,
    gender: int,
    math: float = 70,
    science: float = 70,
    english: float = 70,
    computer: float = 70,
) -> str:
    """
    Structured entry point called by FastAPI /advice endpoint.
    Builds the prompt automatically from student data.
    """
    extracurr_str = "yes" if extracurricular == 1 else "no"
    gender_str    = "male" if gender == 1 else "female"

    message = (
        f"Analyze this student's performance and give personalized advice:\n"
        f"- Study hours per day: {study_hours}\n"
        f"- Attendance: {attendance}%\n"
        f"- Previous grade: {prev_grade}%\n"
        f"- Sleep hours: {sleep_hours}\n"
        f"- Extracurricular activities: {extracurr_str}\n"
        f"- Gender: {gender_str}\n"
        f"- Subject grades — Math: {math}, Science: {science}, "
        f"English: {english}, Computer: {computer}\n\n"
        f"Please predict the grade, explain what is driving it, "
        f"recommend suitable careers, and give actionable advice."
    )
    return run_agent(message)


# ── CLI test ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Testing AI Student Advisor Agent...")
    print("=" * 50)
    response = get_agent_advice(
        study_hours=5,
        attendance=90,
        prev_grade=75,
        sleep_hours=7,
        extracurricular=1,
        gender=1,
        math=85,
        science=70,
        english=60,
        computer=90,
    )
    print(response)
