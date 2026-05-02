# AI-Based Student Performance & Career Recommendation System
### University of South Asia, Lahore — Department of Computer Science

**Team:**
- Abdulrehman — Roll No: B-28721
- Rana Muhammad Gulzaib — Roll No: B-28506

**Submitted To:** Ma'am Rabia | Ma'am Andleeb

---

## Project Ka Overview (Roman Urdu)

Yeh project ek aisa intelligent system hai jo do kaam karta hai:

**Pehla kaam — Grade Prediction:**
Jab student apna data enter kare jaise study hours, attendance, neend, aur
pehle ki grades — to system predict kare ga ke is student ki final grade
kya hogi. Saath hi yeh bhi bataye ga ke student pass hoga ya fail.

**Doosra kaam — Career Recommendation:**
Student ke subject grades (Math, Science, English, Computer) dekh ke system
top 3 career options suggest kare ga jo us student ke liye best suited hain.
Aur ek AI advisor bhi hoga jo student ko personally samjhaye ga ke uski
performance kyun aisi hai aur use kya karna chahiye.

**Kaise kaam kare ga poora system:**
Student React web app mein apna data fill kare ga. Yeh data FastAPI backend
ko jaye ga. Backend ML models chalaye ga, SHAP se explain kare ga, ChromaDB
se MongoDB Atlas Vector Search se semantic career search kare ga, aur Groq LLM se personalized advice
generate kare ga. Groq ki generate ki hui AI advice ko Uplift Orator Studio
API se voice mein convert kiya jaye ga — student apni personalized advice
sun bhi sakta hai. Ek LangChain Agent bhi hoga jo khud sochega aur decide
kare ga ke kaunsa tool call karna hai. Ek MCP Server bhi hoga jo is poore
system ko AI tools ke saath connect kare ga.

---

## Final Architecture Overview

```
React Frontend
      ↓ (REST API calls)
FastAPI Backend (Python)
      ↓
  ┌───────────────────────────────────┐
  │  ML Models  │  MongoDB Atlas  │  SHAP  │
  └───────────────────────────────────┘
      ↓
  ┌──────────────────────────────────┐
  │  MCP Server  │  LangChain Agent  │
  │  (3 tools)   │  (Groq LLM Free)  │
  └──────────────────────────────────┘
        ↓
  ┌──────────────────────────────────┐
  │  Uplift TTS API                  │
  │  (AI advice ko voice mein        │
  │   convert karo — student sune)   │
  └──────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Recharts + Axios |
| Backend | FastAPI (Python) |
| ML Models | Scikit-learn |
| Explainability | SHAP |
| Model Tracking | MLflow |
| Vector Database | MongoDB Atlas Vector Search |
| MCP Server | Python MCP SDK (Anthropic) |
| Agentic AI | LangChain + Groq API (Free) |
| Text to Speech | Uplift Orator Studio API |
| Deployment | Docker + Render / HuggingFace Spaces |

---

## Project Folder Structure

```
data science project/
│
├── frontend/                    # React App
│   └── src/
│       ├── components/          # UI components
│       └── pages/               # Dashboard, About
│
├── backend/                     # FastAPI Backend
│   ├── main.py                  # API endpoints
│   ├── models/                  # Saved ML models (.pkl)
│   ├── services/                # LLM, prediction logic
│   └── vector_db/               # MongoDB Atlas Vector setup
│
├── mcp_server/
│   └── server.py                # MCP Server (3 tools)
│
├── agent/
│   └── student_agent.py         # LangChain Agentic AI
│
├── notebooks/                   # Jupyter notebooks (phases 1-3)
├── data/
│   ├── raw/                     # Kaggle dataset
│   └── processed/               # Cleaned dataset
│
├── mlflow_tracking/             # MLflow experiments
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## PHASE 1 — Data Collection & Preprocessing
**Timeline: Day 1 Morning**
**Owner: Abdulrehman**

**Is phase mein kya hoga:**
Kaggle se student performance dataset download kiya jaye ga. Phir us data
ko saaf kiya jaye ga — missing values fill ki jaengi, duplicate rows hataye
jaenge, aur outliers remove kiye jaenge. Categorical data jaise gender ko
numbers mein convert kiya jaye ga. Relevant features select ki jaengi jaise
study hours, attendance, sleep hours, extracurricular activities. Phir data
ko scale kiya jaye ga aur 80/20 ratio mein train/test split kiya jaye ga.

### Milestones:
- [ ] Kaggle se dataset download karo `data/raw/` mein rakho
- [ ] Data load karo aur structure samjho (shape, columns, types)
- [ ] Missing values handle karo
- [ ] Duplicate rows remove karo
- [ ] Outliers detect aur remove karo (IQR method)
- [ ] Categorical columns encode karo
- [ ] Relevant features select karo
- [ ] Data scale karo (StandardScaler)
- [ ] Train/Test split karo (80% / 20%)
- [ ] Cleaned data `data/processed/` mein save karo

---

## PHASE 2 — Exploratory Data Analysis (EDA)
**Timeline: Day 1 Evening**
**Owner: Abdulrehman**

**Is phase mein kya hoga:**
Data ko visually explore kiya jaye ga taake patterns samajh aayein. Dekha
jaye ga ke kaunsa feature grade pe sabse zyada asar karta hai. Graphs aur
charts banaye jaenge jo project presentation mein bhi use honge.

### Milestones:
- [ ] Correlation Heatmap banao (features ka aapas mein relation)
- [ ] Grade distribution plot banao (kitne students kis range mein hain)
- [ ] Attendance vs Grade scatter plot banao
- [ ] Study Hours vs Grade scatter plot banao
- [ ] Feature importance bar chart banao
- [ ] Sab plots `plots/` folder mein save karo

---

## PHASE 3 — ML Model Development
**Timeline: Day 2**
**Owner: Abdulrehman**

**Is phase mein kya hoga:**
Do ML models train kiye jaenge — Linear Regression aur Random Forest.
Dono ko compare kiya jaye ga metrics ke zariye. Phir Random Forest ko
GridSearchCV se tune kiya jaye ga. SHAP values se explain kiya jaye ga ke
model kyun koi particular prediction de raha hai. MLflow se sab experiments
track kiye jaenge. Aakhir mein sab models save kiye jaenge.

### Milestones:
- [ ] Linear Regression model train karo
- [ ] Linear Regression evaluate karo (RMSE, R²)
- [ ] Random Forest Regressor train karo (grade prediction)
- [ ] Random Forest Classifier train karo (Pass/Fail)
- [ ] Dono models compare karo (RMSE, MAE, R², Accuracy, F1-Score)
- [ ] Confusion Matrix banao
- [ ] Cross Validation karo (5-fold)
- [ ] Hyperparameter Tuning karo (GridSearchCV)
- [ ] SHAP Values calculate karo
- [ ] SHAP Summary Plot banao aur save karo
- [ ] MLflow mein sab experiments log karo
- [ ] Best models `backend/models/` mein pickle karo

---

## PHASE 4 — FastAPI Backend
**Timeline: Day 3**
**Owner: Abdulrehman**

**Is phase mein kya hoga:**
Python FastAPI se ek REST API backend bana`a jaye ga jo React frontend ke
saath communicate kare ga. Is backend mein 4 endpoints honge — grade predict
karne ka, career recommend karne ka, SHAP explanation dene ka, aur Groq LLM
se AI advice lene ka. CORS enable ki jaye gi taake React frontend connect
ho sake.

### Milestones:
- [ ] FastAPI project setup karo
- [ ] CORS configure karo (React ke liye)
- [ ] Saved models load karo
- [ ] `/predict` endpoint banao (grade prediction)
- [ ] `/recommend` endpoint banao (career recommendation)
- [ ] `/explain` endpoint banao (SHAP explanation)
- [ ] `/advice` endpoint banao (Groq LLM advice)
- [ ] Groq API key set karo (free account)
- [ ] LLM service function banao
- [ ] Sab endpoints test karo (FastAPI /docs page se)
- [ ] Server run karo localhost:8000 pe

---

## PHASE 5 — MCP Server
**Timeline: Day 4 Morning**
**Owner: Abdulrehman + Rana Muhammad Gulzaib**

**Is phase mein kya hoga:**
MCP (Model Context Protocol) Server banaya jaye ga jo is poore system ko
AI tools ke saath connect kare ga. Matlab koi bhi AI tool (jaise Claude)
is server ke zariye student ka grade predict kar sakta hai, career recommend
kar sakta hai, aur performance explain kar sakta hai — seedha natural
language mein pooch ke.

### MCP Server ke 3 Tools:
1. **predict_grade** — student data se grade predict kare
2. **recommend_career** — subject grades se top 3 careers bataye
3. **explain_performance** — SHAP se bataye ke grade kyun aisa aaya

### Milestones:
- [ ] MCP SDK install karo
- [ ] `mcp_server/server.py` file banao
- [ ] `predict_grade` tool implement karo
- [ ] `recommend_career` tool implement karo
- [ ] `explain_performance` tool implement karo
- [ ] Sab tools ka input schema define karo
- [ ] Server test karo
- [ ] MCP server ko FastAPI backend se connect karo

---

## PHASE 6 — Agentic AI (LangChain + Groq)
**Timeline: Day 4 Evening**
**Owner: Abdulrehman + Rana Muhammad Gulzaib**

**Is phase mein kya hoga:**
LangChain ka use karke ek AI Agent banaya jaye ga. Yeh agent hardcoded
nahi hoga — yeh khud sochega ke user ke sawaal ka jawab dene ke liye kaunse
tools call karne chahiye. Maslan agar user pooche "is student ki performance
kaisi hai aur career kya hona chahiye?" to agent khud predict_grade() call
kare ga, phir recommend_career() call kare ga, phir dono results combine
karke ek mukammal jawab dega. Groq ka free LLM model use hoga.

### Milestones:
- [ ] LangChain aur langchain-groq install karo
- [ ] `agent/student_agent.py` file banao
- [ ] predict_grade tool define karo (LangChain format mein)
- [ ] recommend_career tool define karo
- [ ] explain_performance tool define karo
- [ ] Groq LLM configure karo (llama3-8b-8192 — free model)
- [ ] System prompt likho agent ke liye
- [ ] AgentExecutor setup karo
- [ ] Agent test karo — multi-step reasoning check karo
- [ ] Agent ko FastAPI `/agent` endpoint se expose karo

---

## PHASE 7 — MongoDB Atlas Vector Search
**Timeline: Day 5 Morning**
**Owner: Rana Muhammad Gulzaib**

**Is phase mein kya hoga:**
MongoDB Atlas Vector Search use kiya jaye ga. Yeh ek cloud-based production
grade database hai jo normal data storage ke saath vector/semantic search bhi
karta hai. Is mein har career ki description store ki jaye gi as vector
embeddings. Jab student ka profile aaye ga to system MongoDB se semantic
search kare ga aur check kare ga ke student ka profile kis career se sabse
zyada milta hai. Saath hi student records aur query history bhi MongoDB mein
store ki jaye gi — yeh project ko real production-level banata hai.

### MongoDB Atlas Mein Kya Store Hoga:
- **careers collection** — 8 careers ki descriptions + vector embeddings
- **students collection** — student queries aur results ki history
- **sessions collection** — agent conversations ka record

### Milestones:
- [ ] MongoDB Atlas account banao (free tier — atlas.mongodb.com)
- [ ] Free cluster create karo (M0 — bilkul free)
- [ ] Database user banao aur connection string lo
- [ ] `pymongo` aur `sentence-transformers` install karo
- [ ] `backend/vector_db/career_db.py` file banao
- [ ] MongoDB Atlas mein Vector Search index banao
- [ ] 8 careers ki descriptions aur embeddings generate karo
- [ ] Careers collection mein data insert karo
- [ ] Semantic search function banao (cosine similarity)
- [ ] Student history save karne ka function banao
- [ ] Vector search ko `/recommend` endpoint mein integrate karo
- [ ] Test karo — different profiles pe search karo

---

## PHASE 7B — Uplift Text to Speech Integration
**Timeline: Day 5 Morning (Phase 7 ke saath)**
**Owner: Rana Muhammad Gulzaib**

**Is phase mein kya hoga:**
Uplift Orator Studio API use karke ek unique feature add kiya jaye ga. Jab
Groq LLM student ke liye personalized advice generate kare ga — woh text
Uplift TTS API ko bheja jaye ga jo use natural voice mein convert kare ga.
React frontend mein ek audio player hoga — student apni advice padh bhi
sakta hai aur sun bhi sakta hai. Yeh feature kisi aur student project mein
nahi hoga.

### Flow:
```
Groq LLM → AI advice text generate kare
      ↓
Uplift TTS API → text ko voice mein convert kare
      ↓
React Frontend → audio player mein play kare
      ↓
Student apni advice sune
```

### Milestones:
- [ ] Uplift Orator Studio pe API key generate karo (platform.upliftai.org)
- [ ] `backend/services/tts_service.py` file banao
- [ ] Uplift TTS API endpoint call karo (advice text bhejo)
- [ ] Audio response ko file mein save karo ya stream karo
- [ ] FastAPI mein `/tts` endpoint banao
- [ ] React mein audio player component banao
- [ ] AI advice box ke saath audio player integrate karo
- [ ] Test karo — advice sun ke verify karo
- [ ] Credits usage monitor karo (10k credits available)

---

## PHASE 8 — React Frontend
**Timeline: Day 5 Evening**
**Owner: Rana Muhammad Gulzaib**

**Is phase mein kya hoga:**
React se ek professional web app banaya jaye ga. Isme student apna data
enter kare ga aur ek button click se predicted grade, career recommendations,
SHAP chart, aur AI advice sab ek dashboard pe dikhe ga. Recharts library se
graphs banaye jaenge. Axios se FastAPI backend ko call kiya jaye ga.

### Pages:
- **Dashboard** — main page jahan sab kuch hoga
- **About** — project ke baare mein info

### Components:
- **StudentForm** — input form (sliders + dropdowns)
- **ResultCard** — predicted grade aur pass/fail status
- **CareerChart** — top 3 careers ka bar chart
- **ShapChart** — SHAP waterfall chart
- **AIAdviceBox** — Groq LLM ki personalized advice

### Milestones:
- [ ] Vite + React project setup karo
- [ ] Tailwind CSS install karo (styling ke liye)
- [ ] Recharts install karo (charts ke liye)
- [ ] Axios install karo (API calls ke liye)
- [ ] StudentForm component banao
- [ ] ResultCard component banao
- [ ] CareerChart component banao
- [ ] ShapChart component banao
- [ ] AIAdviceBox component banao
- [ ] Dashboard page banao (sab components integrate karo)
- [ ] FastAPI backend se connect karo
- [ ] UI test karo — sab inputs try karo
- [ ] Responsive design check karo

---

## PHASE 9 — Docker + Deployment
**Timeline: Day 6**
**Owner: Rana Muhammad Gulzaib**

**Is phase mein kya hoga:**
Poore project ko Docker mein containerize kiya jaye ga taake kisi bhi
machine pe easily run ho sake. Phir Hugging Face Spaces ya Render pe free
mein deploy kiya jaye ga. Professors ko ek live link milega — woh seedha
browser mein project test kar sakenge bina kuch install kiye.

### Milestones:
- [ ] `requirements.txt` complete karo (sab Python dependencies)
- [ ] Backend ka Dockerfile banao
- [ ] Frontend ka Dockerfile banao
- [ ] `docker-compose.yml` banao (dono services ko saath run kare)
- [ ] Local pe docker-compose up chalao aur test karo
- [ ] Hugging Face Spaces pe account banao (free)
- [ ] Project deploy karo
- [ ] Live link test karo
- [ ] Link professors ke saath share karo

---

## PHASE 10 — Testing & Documentation
**Timeline: Day 7**
**Owner: Both**

**Is phase mein kya hoga:**
Poora system thoroughly test kiya jaye ga. Sab edge cases check kiye
jaenge. README file likhi jaye gi. MLflow ke screenshots liye jaenge.
Presentation slides banaye jaenge. Aur ek live demo prepare kiya jaye ga.

### Testing Milestones:
- [ ] Sab FastAPI endpoints test karo (/docs page se)
- [ ] React form sab inputs ke saath test karo
- [ ] Edge cases test karo (0 study hours, 100% attendance)
- [ ] MCP server ke 3 tools test karo
- [ ] LangChain Agent ka multi-step reasoning test karo
- [ ] MongoDB Atlas Vector Search test karo
- [ ] Uplift TTS audio output test karo
- [ ] Mobile responsive check karo
- [ ] Docker deployment test karo

### Documentation Milestones:
- [ ] README.md likho (project overview + how to run)
- [ ] MLflow experiment screenshots lo
- [ ] SHAP plots save karo presentation ke liye
- [ ] Presentation slides banao (10 slides)
- [ ] Live demo script prepare karo

---

## Team Division Summary

| Phase | Abdulrehman | Rana Muhammad Gulzaib |
|---|---|---|
| Phase 1 — Data + Preprocessing | ✅ | |
| Phase 2 — EDA | ✅ | |
| Phase 3 — ML Models + SHAP + MLflow | ✅ | |
| Phase 4 — FastAPI Backend | ✅ | |
| Phase 5 — MCP Server | ✅ | ✅ |
| Phase 6 — Agentic AI (LangChain) | ✅ | ✅ |
| Phase 7 — MongoDB Atlas Vector Search | | ✅ |
| Phase 7B — Uplift TTS Integration | | ✅ |
| Phase 8 — React Frontend | | ✅ |
| Phase 9 — Docker + Deployment | | ✅ |
| Phase 10 — Testing + Documentation | ✅ | ✅ |

---

## 1 Week Timeline

| Din | Kaam |
|---|---|
| **Day 1** | Phase 1 + Phase 2 — Data tayyar karo, EDA karo |
| **Day 2** | Phase 3 — ML Models banao, SHAP, MLflow |
| **Day 3** | Phase 4 — FastAPI backend ke sab endpoints |
| **Day 4** | Phase 5 + Phase 6 — MCP Server + LangChain Agent |
| **Day 5** | Phase 7 + Phase 7B + Phase 8 — MongoDB Atlas + Uplift TTS + React Frontend |
| **Day 6** | Phase 9 — Docker + Live Deployment |
| **Day 7** | Phase 10 — Testing + Documentation + Presentation |

---

## Is Project Ko Special Kya Banata Hai

```
React Frontend       — Professional aur modern UI
FastAPI Backend      — Production-grade REST API
Linear Regression    — Grade prediction (basic model)
Random Forest        — Grade prediction + Pass/Fail (advanced model)
SHAP Values          — Explainable AI (model kyun yeh decision le raha hai)
MLflow               — Professional experiment tracking
MongoDB Atlas        — Cloud database + Vector Search for smart career matching
MCP Server           — AI tools integration (3 tools)
LangChain Agent      — Agentic AI (khud sochta hai, khud decide karta hai)
Groq LLM (Free)      — Personalized AI advice
Uplift TTS API       — AI advice ko voice mein convert karo (sun bhi sako)
Docker               — Containerized deployment
Live Deployment      — Professors browser mein test kar sakenge
```

---

*Project Plan — AI Student Advisor | University of South Asia, Lahore*
