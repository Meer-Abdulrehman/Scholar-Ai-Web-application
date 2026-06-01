from docx import Document
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from docx.shared import Pt
import os

project_title = "Scholar.AI — Student Performance & Career Recommendation System"
team = ["Abdulrehman (B-28721)", "Rana Muhammad Gulzaib (B-28506)"]
authors = ", ".join(team)
model_name = "scholar.ai"
output_path = "docs/scholar_ai_project_report.docx"

if not os.path.exists('docs'):
    os.makedirs('docs')

doc = Document()
style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(11)

# Title page
p = doc.add_paragraph()
p.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
r = p.add_run(project_title + '\n')
r.bold = True
r.font.size = Pt(24)

p2 = doc.add_paragraph()
p2.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
p2.add_run('Concise Project Report\n').font.size = Pt(12)

p3 = doc.add_paragraph()
p3.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
p3.add_run(f'Team: {authors}\n')
p3.add_run(f'Model: {model_name}\n')
p3.add_run('University of South Asia, Lahore\n')
p3.add_run('Date: May 31, 2026\n')

doc.add_page_break()

# Headings and concise bullet content
sections = [
    ('Abstract', [
        'Scholar.AI predicts student final grades and recommends careers using subject strengths.',
        'Combines ML models, SHAP explainability, semantic career search, and an LLM-based advisor.',
        'Target audience: students and academic advisors for early intervention.'
    ]),

    ('Introduction', [
        'Scholar.AI is built to support students with early performance insights and career guidance.',
        'The system focuses on grade prediction, explainable AI, track-aware career recommendation, and AI advice.',
        'Its architecture includes a React frontend, FastAPI backend, ML services, vector search, and an agent layer.'
    ]),

    ('Problem Statement', [
        'Many students do not receive timely, personalized feedback about their academic performance.',
        'Most existing tools either predict grades without explanation or give generic career advice.',
        'Scholar.AI solves this by combining explainable prediction with track-aware career recommendations and AI advice.'
    ]),

    ('Literature Review', [
        'Prior works commonly use UCI student datasets to predict academic performance.',
        'Explainability methods such as SHAP and LIME are used to make predictions easier to understand.',
        'Newer systems combine machine learning, semantic search, and LLMs for better student guidance.'
    ]),

    ('Data Collection', [
        'Raw data was taken from student-mat.csv and student-por.csv from the Kaggle/UCI student datasets.',
        'The data was merged, cleaned, encoded, and scaled before saving to data/processed/student_clean.csv.',
        'Important features include math, science, english, computer, biology, study_hours, and attendance.'
    ]),

    ('Exploratory Data Analysis (EDA)', [
        'Attendance, previous grade, and study hours show strong relationships with the final grade.',
        'Subject strengths help identify suitable tracks, especially Biology for medical careers.',
        'The analysis uses correlation heatmaps, grade distributions, and scatter plots.'
    ]),

    ('Feature Engineering', [
        'Derived features such as prev_avg, study_efficiency, and subject z-scores improve model learning.',
        'Categorical values like gender and extracurricular activity were encoded into numeric form.',
        'StandardScaler was used so all model inputs stay on a comparable scale.'
    ]),

    ('Modeling', [
        'Linear Regression and Random Forest were used for grade prediction.',
        'A Random Forest Classifier was used for Pass/Fail prediction.',
        'MLflow was used to track experiments, parameters, and evaluation results.'
    ]),

    ('Model Training Details', [
        'The data was split into 80% training and 20% testing sets.',
        'GridSearchCV was used to tune important Random Forest parameters such as n_estimators and max_depth.',
        'Performance was measured using RMSE, R², Accuracy, and F1-score.'
    ]),

    ('Explainability (SHAP)', [
        'SHAP values show how much each feature contributes to an individual prediction.',
        'These explanations can be turned into actionable advice such as improving attendance or study hours.',
        'SHAP plots are included for interpretation and reporting.'
    ]),

    ('Career Recommendation System', [
        'Scholar.AI uses a hybrid recommender that combines deterministic rules, vector search, and LLM refinement.',
        'For Pre‑Medical students, Biology score ranges are mapped to medical career tiers such as assistants, D-Pharmacy, and MBBS.',
        'When advanced services are unavailable, cosine-similarity fallback profiles are used.'
    ]),

    ('Agent & MCP Server', [
        'A LangChain ReAct agent orchestrates the tools predict_grade, recommend_career, and explain_performance.',
        'The MCP server exposes the same capabilities for other AI clients.',
        'Groq LLM is used when the API key is available.'
    ]),

    ('Vector DB & Semantic Search', [
        'Career descriptions are embedded and stored in MongoDB Atlas Vector Search.',
        'Semantic search helps match student profiles with career descriptions beyond simple subject scores.'
    ]),

    ('TTS Integration', [
        'The AI advice text is converted to speech using Uplift Orator Studio.',
        'The frontend can play the generated audio through the /tts endpoint.'
    ]),

    ('Frontend Architecture', [
        'React + Vite + Tailwind are used for the frontend interface.',
        'Main components include StudentForm, ResultCard, CareerChart, ShapChart, and AIAdviceBox.',
        'The /analyze endpoint returns prediction, SHAP, career recommendations, and advice together.'
    ]),

    ('Backend Architecture', [
        'FastAPI services are split into prediction, career, tts, and vector_db modules.',
        'Endpoints include /predict, /recommend, /explain, /advice, /analyze, /tts, and /history.',
        'Pickled ML models are loaded from backend/models.'
    ]),

    ('Deployment', [
        'Docker is used to package both frontend and backend for reproducible deployment.',
        'A backend VM or Render service can host the API, while the frontend can be deployed on Vercel or Hugging Face Spaces.',
        'Environment variables should be used for API keys and database URIs.'
    ]),

    ('Security Considerations', [
        'API keys should not be committed and must stay in backend/.env.',
        'CORS should be restricted to trusted frontend origins, and pickled models must be loaded only from trusted files.'
    ]),

    ('Testing & Validation', [
        'Unit tests should cover core services and integration tests should validate API endpoints.',
        'End-to-end checks should confirm that UI forms, analysis results, and audio advice all work correctly.'
    ]),

    ('Limitations & Future Work', [
        'A larger labeled career dataset is needed for a fully data-driven career model.',
        'Future improvements can include fairness checks, broader datasets, and multi-lingual support.'
    ]),

    ('Conclusion', [
        'Scholar.AI provides an integrated and explainable workflow for predicting grades and recommending careers.',
        'Its modular design makes future model upgrades and dataset expansion straightforward.'
    ]),

    ('References', [
        'UCI Student Performance Dataset, scikit-learn, SHAP, LangChain, MongoDB Atlas Vector Search, and Uplift Orator TTS.'
    ]),

    ('Appendix A — Data Dictionary', [
        'math, science, english, computer, biology: subject grades on a 0-100 scale.',
        'study_hours: hours per day; attendance: percentage; prev_grade: previous term grade; extracurricular: 0/1.'
    ]),

    ('Appendix B — Model Artifacts', [
        'Files in backend/models include random_forest.pkl, linear_regression.pkl, rf_classifier.pkl, and scaler.pkl.',
        'The career training script is scripts/train_career_recommender.py.'
    ]),

    ('Appendix C — API Examples', [
        'POST /analyze with student JSON returns prediction, SHAP, careers, and advice.',
        "curl example: curl -X POST http://localhost:8000/analyze -H 'Content-Type: application/json' -d '{\"study_hours\":5,...}'"
    ]),
]

# Build document
for heading, bullets in sections:
    doc.add_heading(heading, level=1)
    for b in bullets:
        p = doc.add_paragraph(style='List Bullet')
        p.add_run(b)
    doc.add_page_break()

# Save
if os.path.exists(output_path):
    os.remove(output_path)

doc.save(output_path)
print(f"Generated concise report: {output_path}")
