"""Train a career recommender classifier from a labeled CSV.

Expected input CSV columns:
 - math, science, english, computer, biology (at least some of these)
 - career (string label)

Saves model artifacts to `backend/models/`:
 - career_clf.pkl
 - career_label_encoder.pkl
 - career_classes.json

Usage:
  python scripts/train_career_recommender.py --input data/processed/career_labeled.csv
"""
import argparse
import json
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import joblib


def main(input_csv: str, out_dir: str = "backend/models"):
    inp = Path(input_csv)
    if not inp.exists():
        raise SystemExit(f"Input file not found: {input_csv}")

    df = pd.read_csv(inp)
    required = ["math", "science", "english"]
    # allow either computer or biology or both
    if not any(c in df.columns for c in ["computer", "biology"]):
        raise SystemExit("CSV must include at least one of 'computer' or 'biology' columns")

    # fill missing subject columns with 0
    for col in ["math", "science", "english", "computer", "biology"]:
        if col not in df.columns:
            df[col] = 0
        df[col] = df[col].fillna(0).astype(float)

    if "career" not in df.columns:
        raise SystemExit("CSV must include a 'career' column with target labels")

    X = df[["math", "science", "english", "computer", "biology"]].values
    y = df["career"].astype(str).values

    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_enc, test_size=0.2, random_state=42, stratify=y_enc)

    clf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    print("Classification report:")
    print(classification_report(y_test, preds, target_names=le.classes_))

    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, out / "career_clf.pkl")
    joblib.dump(le, out / "career_label_encoder.pkl")
    # also save classes for quick lookup
    with open(out / "career_classes.json", "w", encoding="utf-8") as f:
        json.dump(list(le.classes_), f, ensure_ascii=False, indent=2)

    print(f"Saved model and encoders to {out}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Labeled CSV file path")
    parser.add_argument("--out", default="backend/models", help="Output models directory")
    args = parser.parse_args()
    main(args.input, args.out)
