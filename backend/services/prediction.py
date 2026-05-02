import pickle
from pathlib import Path
import numpy as np
import shap

# Resolve models folder relative to this file — works from any working directory
MODELS_DIR = Path(__file__).parent.parent / "models"

rf_model = pickle.load(open(MODELS_DIR / "random_forest.pkl",    "rb"))
rf_clf   = pickle.load(open(MODELS_DIR / "rf_classifier.pkl",   "rb"))
lr_model = pickle.load(open(MODELS_DIR / "linear_regression.pkl","rb"))
scaler   = pickle.load(open(MODELS_DIR / "scaler.pkl",          "rb"))

FEATURE_NAMES = ["study_hours", "attendance", "prev_grade",
                 "sleep_hours", "extracurricular", "gender"]


def predict_grade(study_hours: float, attendance: float, prev_grade: float,
                  sleep_hours: float, extracurricular: int, gender: int) -> dict:
    features = [[study_hours, attendance, prev_grade,
                 sleep_hours, extracurricular, gender]]
    scaled = scaler.transform(features)

    grade_rf = float(rf_model.predict(scaled)[0])
    grade_lr = float(lr_model.predict(scaled)[0])
    status   = int(rf_clf.predict(scaled)[0])
    avg      = (grade_rf + grade_lr) / 2

    if avg >= 80:
        level = "Excellent"
    elif avg >= 65:
        level = "Good"
    elif avg >= 50:
        level = "Average"
    else:
        level = "Needs Improvement"

    return {
        "grade_rf":  round(grade_rf, 1),
        "grade_lr":  round(grade_lr, 1),
        "avg_grade": round(avg, 1),
        "status":    "Pass" if status == 1 else "Fail",
        "level":     level,
    }


def explain_performance(study_hours: float, attendance: float, prev_grade: float,
                        sleep_hours: float, extracurricular: int, gender: int) -> dict:
    features = [[study_hours, attendance, prev_grade,
                 sleep_hours, extracurricular, gender]]
    scaled = scaler.transform(features)

    explainer   = shap.TreeExplainer(rf_model)
    shap_values = explainer.shap_values(scaled)

    base_val = explainer.expected_value
    if hasattr(base_val, "__len__"):
        base_val = float(base_val[0])
    else:
        base_val = float(base_val)

    row = shap_values[0] if isinstance(shap_values, list) else shap_values[0]
    contributions = [
        {"feature": FEATURE_NAMES[i], "shap_value": round(float(row[i]), 3)}
        for i in range(len(FEATURE_NAMES))
    ]
    contributions.sort(key=lambda x: abs(x["shap_value"]), reverse=True)

    return {
        "base_value":    round(base_val, 2),
        "predicted":     round(float(rf_model.predict(scaled)[0]), 1),
        "contributions": contributions,
    }
