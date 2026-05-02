# UI Design Specification

## AI-Based Student Performance & Career Recommendation System

---

## Design Theme

```
Style:        Modern, Clean, Professional
Theme:        Dark Mode (default) + Light Mode toggle
Font:         Inter (headings) + Poppins (body)
Border Radius: Rounded corners (8px - 16px)
```

### Color Palette

AI project ke liye **Deep Navy + Electric Blue + Cyan** theme — professional aur modern.

| Name             | Color Code | Use                                      | Preview |
| ---------------- | ---------- | ---------------------------------------- | ------- |
| Primary          | #2563EB    | Buttons, highlights, active states       | Deep Blue |
| Primary Hover    | #1D4ED8    | Button hover state                       | Darker Blue |
| Accent           | #06B6D4    | Charts, icons, special highlights        | Cyan |
| Success          | #10B981    | Pass status, positive results            | Emerald Green |
| Danger           | #EF4444    | Fail status, errors, negative SHAP       | Solid Red |
| Warning          | #F59E0B    | Medium performance, caution              | Amber |
| Background Dark  | #0B1120    | Main background (dark mode)              | Deep Navy |
| Card Dark        | #111827    | Cards background (dark mode)             | Dark Gray-Navy |
| Card Dark 2      | #1F2937    | Inner cards, hover state                 | Medium Dark |
| Background Light | #F8FAFC    | Main background (light mode)             | Off White |
| Card Light       | #FFFFFF    | Cards background (light mode)            | White |
| Card Light 2     | #F1F5F9    | Inner cards (light mode)                 | Light Gray |
| Text Primary     | #F9FAFB    | Main text (dark) / #111827 (light)       | White / Dark |
| Text Secondary   | #9CA3AF    | Subtext, labels (dark) / #6B7280 (light) | Gray |
| Border Dark      | #1F2937    | Card borders (dark mode)                 | Dark border |
| Border Light     | #E2E8F0    | Card borders (light mode)                | Light border |
| Navbar           | #0F172A    | Navbar background                        | Darkest Navy |
| Hero Gradient    | #2563EB → #06B6D4 | Hero section background           | Blue to Cyan |

---

## Pages

### 1. Dashboard (Main Page)

### 2. History Page

### 3. About Page

---

## PAGE 1 — DASHBOARD

### Layout Structure:

```
┌──────────────────────────────────────────────────────┐
│                    NAVBAR                             │
├──────────────────────────────────────────────────────┤
│                  HERO SECTION                         │
│         (Title + Short Description)                   │
├────────────────────┬─────────────────────────────────┤
│                    │                                  │
│   INPUT FORM       │     RESULTS PANEL                │
│   (Left Side)      │     (Right Side)                 │
│                    │     (shows after submit)         │
│                    │                                  │
└────────────────────┴─────────────────────────────────┘
```

---

### NAVBAR

```
┌──────────────────────────────────────────────────────┐
│  🎓 Student AI Advisor    Dashboard  History  About  🌙│
└──────────────────────────────────────────────────────┘
```

**Details:**

- Logo + App name (left side)
- Navigation links: Dashboard, History, About (center)
- Dark/Light mode toggle icon (right side)
- Background: Card Dark color
- Border bottom: 1px solid border color
- Position: Sticky (stays on top while scrolling)
- Height: 64px

---

### HERO SECTION

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│      🎓 AI Student Performance Advisor               │
│   Predict your grades. Discover your career path.   │
│                                                      │
│   [ 📊 Grade Prediction ]  [ 🎯 Career Match ]       │
│         (stat card)              (stat card)         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Details:**

- Background: Gradient (Primary to Secondary color — left to right)
- Title: 32px, bold, white
- Subtitle: 16px, white 80% opacity
- Two small stat cards below title
- Padding: 40px top and bottom

---

### INPUT FORM (Left Panel)

```
┌─────────────────────────────┐
│  📋 Student Information      │
│─────────────────────────────│
│                             │
│  Study Hours per Day        │
│  ●───────────────○  3.0 hrs │
│                           │
│  Attendance (%)             │
│  ●──────────────○   75%     │
│                             │
│  Previous Grade (%)         │
│  ●──────────────○   60%     │
│                             │
│  Sleep Hours per Day        │
│  ●──────────────○   7 hrs   │
│                             │
│  Extracurricular Activities │
│  [ Yes ]  [ No ]            │
│                             │
│  Gender                     │
│  [ Male ]  [ Female ]       │
│                             │
│─────────────────────────────│
│  📚 Subject Grades           │
│─────────────────────────────│
│                             │
│  Math           [  75  ]    │
│  ████████░░  75/100         │
│                             │
│  Science        [  70  ]    │
│  ███████░░░  70/100         │
│                             │
│  English        [  65  ]    │
│  ██████░░░░  65/100         │
│                             │
│  Computer       [  80  ]    │
│  ████████░░  80/100         │
│                             │
│─────────────────────────────│
│                             │
│  [ 🔍 Analyze & Recommend ] │
│                             │
└─────────────────────────────┘
```

**Details:**

- Card background: Card Dark
- Border: 1px solid border color
- Border radius: 16px
- Padding: 24px
- Section title: 16px, bold, Primary color
- Slider: Custom styled, Primary color thumb
- Toggle buttons (Yes/No, Male/Female): Pill shaped, active = Primary color
- Subject grade inputs: Number input + progress bar below
- Submit button:
  - Full width
  - Background: Primary color gradient
  - Height: 48px
  - Border radius: 12px
  - Font: 16px bold white
  - Hover: slightly lighter, scale 1.02
  - Loading state: spinner inside button

---

### RESULTS PANEL (Right Panel)

**Default State (before submit):**

```
┌─────────────────────────────────┐
│                                 │
│    🤖 Enter your details        │
│    and click Analyze to         │
│    see your results here        │
│                                 │
│    [Illustration / Icon]        │
│                                 │
└─────────────────────────────────┘
```

**After Submit — Results State:**

#### A. Grade Result Card

```
┌─────────────────────────────────┐
│  📊 Predicted Performance       │
│─────────────────────────────────│
│                                 │
│   ┌──────────┐  ┌────────────┐  │
│   │  72.5%   │  │  ✅ PASS   │  │
│   │  Grade   │  │  Status    │  │
│   └──────────┘  └────────────┘  │
│                                 │
│  Performance Level:             │
│  ████████░░  Good               │
│                                 │
└─────────────────────────────────┘
```

**Details:**

- Grade number: 48px, bold, Primary color
- Pass: Secondary (green) color badge
- Fail: Danger (red) color badge
- Progress bar shows performance level

---

#### B. Career Recommendation Card

```
┌─────────────────────────────────┐
│  🎯 Top Career Recommendations  │
│─────────────────────────────────│
│                                 │
│  🥇 Software Engineer           │
│     ████████████  95% match     │
│                                 │
│  🥈 Data Scientist              │
│     ██████████░░  88% match     │
│                                 │
│  🥉 Business Analyst            │
│     ████████░░░░  76% match     │
│                                 │
└─────────────────────────────────┘
```

**Details:**

- Each career has rank emoji, name, match % bar
- Bar colors: Gold, Silver, Bronze for top 3
- Hover: card slightly lifts (box shadow)

---

#### C. SHAP Explanation Card

```
┌─────────────────────────────────┐
│  📊 Why This Grade?             │
│  (SHAP Waterfall Chart)         │
│─────────────────────────────────│
│                                 │
│  attendance    ████  +8.2       │
│  study_hours   ███   +5.1       │
│  prev_grade    ██    +3.4       │
│  sleep_hours   █     +1.2       │
│  extracurr     ░     -0.8       │
│                                 │
│  Base: 65.0 → Final: 72.5       │
│                                 │
└─────────────────────────────────┘
```

**Details:**

- Positive bars: Secondary (green) color
- Negative bars: Danger (red) color
- Horizontal bar chart
- Feature names on left, values on right

---

#### D. AI Advice Card

```
┌─────────────────────────────────┐
│  🤖 AI Personalized Advice      │
│─────────────────────────────────│
│                                 │
│  "Your attendance is strong     │
│   at 75%, which is positively   │
│   impacting your grade. To      │
│   improve further, increase     │
│   daily study hours from 3 to   │
│   4-5 hours..."                 │
│                                 │
│─────────────────────────────────│
│  🔊 Listen to Advice            │
│  ┌─────────────────────────┐    │
│  │ ▶  ──────────○────  🔈  │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Details:**

- Advice text: 14px, line height 1.6
- Audio player: Custom styled
- Play button: Primary color circle
- Progress bar: Primary color
- Volume icon on right

---

#### E. Subject Radar Chart Card

```
┌─────────────────────────────────┐
│  📈 Subject Performance Radar   │
│─────────────────────────────────│
│                                 │
│         Math                    │
│          /\                     │
│  Comp   /  \  Science           │
│        /    \                   │
│        \    /                   │
│  Eng    \  /                    │
│          \/                     │
│                                 │
└─────────────────────────────────┘
```

**Details:**

- Recharts RadarChart component
- Fill: Primary color with 30% opacity
- Stroke: Primary color solid
- Grid lines: Border color

---

## PAGE 2 — HISTORY PAGE

```
┌──────────────────────────────────────────────────────┐
│                    NAVBAR                             │
├──────────────────────────────────────────────────────┤
│  📋 My Analysis History                               │
│  Total Analyses: 12    Average Grade: 71.2%          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Analysis #12        30 Apr 2026, 3:45 PM     │   │
│  │ Grade: 72.5%  ✅ Pass  Top Career: SW Eng    │   │
│  │                              [ View Details ]│   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Analysis #11        29 Apr 2026, 11:20 AM    │   │
│  │ Grade: 65.0%  ✅ Pass  Top Career: Teacher   │   │
│  │                              [ View Details ]│   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Details:**

- History cards list — latest first
- Each card: grade, status, top career, timestamp
- "View Details" button expands full result
- Data comes from MongoDB students collection

---

## PAGE 3 — ABOUT PAGE

```
┌──────────────────────────────────────────────────────┐
│                    NAVBAR                             │
├──────────────────────────────────────────────────────┤
│                                                      │
│   About This Project                                 │
│                                                      │
│   ┌──────────────┐  ┌──────────────┐                │
│   │ Abdulrehman  │  │ Rana Gulzaib │                │
│   │ B-28721      │  │ B-28506      │                │
│   │ ML + Backend │  │ UI + DB      │                │
│   └──────────────┘  └──────────────┘                │
│                                                      │
│   Tech Stack Used:                                   │
│   [React] [FastAPI] [MongoDB] [SHAP] [LangChain]    │
│   [MLflow] [Groq] [Uplift TTS] [Docker] [MCP]       │
│                                                      │
│   University of South Asia, Lahore                  │
│   Department of Computer Science                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Loading States

### Button Loading:

```
[ 🔍 Analyze & Recommend ]
        ↓ (click)
[ ⟳  Analyzing...        ]
```

### Results Loading (Skeleton):

```
┌─────────────────────┐
│ ░░░░░░░░░░░░░░░░░░  │  ← shimmer animation
│ ░░░░░░░░            │
│ ░░░░░░░░░░░░░░      │
└─────────────────────┘
```

---

## Responsive Design

| Screen Size       | Layout                               |
| ----------------- | ------------------------------------ |
| Desktop (1200px+) | 2 column — form left, results right |
| Tablet (768px)    | 2 column — slightly compressed      |
| Mobile (480px)    | 1 column — form top, results bottom |

---

## Animations

| Element         | Animation                    |
| --------------- | ---------------------------- |
| Page load       | Fade in (0.3s)               |
| Results appear  | Slide up + fade in (0.4s)    |
| Cards hover     | Scale 1.02 + shadow          |
| Button hover    | Scale 1.02 + brightness      |
| Progress bars   | Fill animation left to right |
| Numbers (grade) | Count up animation           |
| Audio player    | Smooth progress              |

---

## React Components List

```
src/
├── components/
│   ├── Navbar.jsx               # Top navigation bar
│   ├── StudentForm.jsx          # Input form (left panel)
│   ├── SubjectGrades.jsx        # Subject grade inputs
│   ├── ResultCard.jsx           # Grade + status card
│   ├── CareerChart.jsx          # Top 3 careers with bars
│   ├── ShapChart.jsx            # SHAP waterfall chart
│   ├── AIAdviceBox.jsx          # AI advice + audio player
│   ├── RadarChart.jsx           # Subject radar chart
│   ├── HistoryCard.jsx          # Single history entry
│   ├── SkeletonLoader.jsx       # Loading placeholder
│   └── ThemeToggle.jsx          # Dark/light mode switch
│
├── pages/
│   ├── Dashboard.jsx            # Main page
│   ├── History.jsx              # History page
│   └── About.jsx                # About page
│
├── hooks/
│   └── useAnalyze.js            # API call logic
│
└── utils/
    └── api.js                   # Axios API functions
```

---

## Important Notes for Developer

1. **Tailwind CSS** use karo styling ke liye
2. **Recharts** use karo sab charts ke liye
3. **Framer Motion** use karo animations ke liye
4. **React Router** use karo pages ke liye
5. **Dark mode** default rakho — light mode toggle se change ho
6. **Mobile first** approach follow karo
7. Sab cards mein **loading skeleton** hona chahiye
8. Audio player **custom styled** hona chahiye — browser default nahi

---

*UI Design Spec — AI Student Advisor | University of South Asia, Lahore*
