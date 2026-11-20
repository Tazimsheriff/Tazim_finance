# FinPulse AI — Autonomous Financial Intelligence Platform

> **Engineered for Tazim Finance Solutions**  
> *Transforming raw financial data into predictive clarity, detecting anomalies in real-time, optimizing cash runway, and enabling smarter capital decisions for individuals and businesses.*

---

## 🌟 Core Pillars & AI Architecture

FinPulse AI is a full-stack, enterprise-grade financial management platform designed to automate financial oversight, eliminate waste, and provide continuous algorithmic auditing.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FinPulse AI System Stack                        │
├────────────────────────────────────────────────────────────────────────┤
│  Interactive UI:  React 19 + Tailwind CSS + Lucide Icons               │
│  Dual Personas:   Personal Wealth Mode  &  Business / Enterprise Mode │
├────────────────────────────────────────────────────────────────────────┤
│  AI Engine Modules:                                                    │
│  ├─ AI Auto-Categorizer (NLP Keyword & Pattern Recognition)            │
│  ├─ Anomaly Sentinel (Z-Score > 2.8σ, IQR Outliers, Duplicate Swipes)  │
│  ├─ Subscription Vault (Zombie Detector, Price Creep & Cadence)        │
│  ├─ Smart Budget Planner (Pacing Envelopes & Dynamic Rebalancing)      │
│  ├─ Capital Runway Calculator (Macro Stress-Testing & Burn Velocity)   │
│  └─ Conversational Copilot (Natural Language Q&A & Actionable Advice)  │
├────────────────────────────────────────────────────────────────────────┤
│  Integrations: CSV Statement Auto-Parser, JSON Export, Double-Entry DB │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. Dual Persona Financial Management
- **Personal Wealth Mode**: Tracks checking, high-yield savings (HYSA), credit cards, and investments (ETFs/Index Funds). Built-in **50/30/20 rule allocator** (Needs, Wants, Savings).
- **Business & Enterprise Mode**: Tracks operating accounts, merchant holding (Stripe), corporate credit cards (Brex/Amex), and treasury reserves. Displays **Net Monthly Burn**, **Zero-Revenue Runway**, and SaaS efficiency.

### 2. AI Anomaly & Fraud Detection Engine
- **Duplicate Charge Detection**: Detects identical amounts charged by the same merchant within a 72-hour window.
- **Statistical Outlier Detection**: Computes rolling Z-scores and Interquartile Ranges (IQR) per category to flag sudden surges (e.g., unexpected token spikes, hardware purchases, or foreign transactions).
- **Severity & Risk Scoring**: Flags events as `Critical`, `High`, or `Medium` with an explainability card ("Why this was flagged") and one-click actions: **Confirm Legit**, **Dispute / Block**, or **Adjust Thresholds**.

### 3. Pattern Recognition & Zombie Subscription Finder
- **Cadence Analyzer**: Automatically detects recurring monthly and annual charges.
- **Zombie Finder**: Flags recurring expenses with zero activity or log-in events in the past 45+ days (e.g. unused gym passes, dormant software seats).
- **Price Creep Detector**: Alerts you when a subscription quietly increases in price.
- **Day-of-the-Week Spend Heatmap**: Identifies impulse spending days (e.g. weekend dining spikes vs weekday operations).

### 4. Smart Budgeting & Dynamic Rebalancing
- **Pacing Engine**: Compares day-of-month progress against spend rate to warn of impending overspends before they occur.
- **Algorithmic Rebalancing**: Automatically identifies surplus in underspent categories and suggests reallocating to categories facing a deficit.

### 5. Interactive Scenario Simulator
- Sliders for **Revenue / Income Changes** (-40% to +40%), **Discretionary Spending Reductions** (0% to 40%), and **One-Time Capital Purchases** ($0 to $20,000).
- Immediate recalculation of monthly net margin, emergency fund longevity, and cash runway.

### 6. Conversational AI Financial Advisor
- Natural language query answering:
  - *"Where can I cut $300 this month?"*
  - *"Show my largest subscriptions and zombie charges"*
  - *"What is my business runway if revenue drops 25%?"*
  - *"How much did I spend on food and dining?"*

---

## 🧪 Comprehensive Automated Test Suites

FinPulse AI includes a 100% passing automated test suite across all AI and financial calculation engines:

```bash
# Run JavaScript/React Unit & Integration Tests (Vitest)
npm test

# Run Python Unit Tests
python -m unittest discover -s tests
```

- **5 Test Suites, 20+ Automated Tests**:
  - `aiCategorizer.test.js`: Validates NLP categorization accuracy across diverse merchants and confidence thresholds.
  - `anomalyEngine.test.js`: Verifies 72-hour duplicate detection, statistical outlier z-score flags, and risk scoring.
  - `patternEngine.test.js`: Validates subscription grouping, zombie detection, and 50/30/20 breakdown.
  - `budgetEngine.test.js`: Verifies pacing calculations, overspend warnings, dynamic envelope rebalancing, and macro runway shock tests.
  - `aiAdvisorEngine.test.js`: Verifies strategic insight generation and conversational natural language question answering.
  - `test_tazim_ai_finance.py`: Verifies headless Python audit and anomaly detection routines.

---

## 💻 Quick Start & Running the Platform

### Option A: Launch Interactive Web Application
```bash
# 1. Start the Vite development server
npm run dev

# 2. Or build for production preview
npm run build
npm run preview
```

Open your browser to `http://localhost:5173` (or the port shown in terminal).

### Option B: Run Headless Python Financial Audit CLI
```bash
python tazim_ai_finance.py
```

---

## 📁 Repository Directory Structure

```
t:\TAZIM FINANCE\
├── src\
│   ├── components\
│   │   ├── Navbar.jsx                # Header, Persona Switcher & Navigation
│   │   ├── KPICards.jsx              # Executive Metric Cards (Reserves, Inflow/Outflow, Runway)
│   │   ├── DashboardOverview.jsx     # Visual Trends, Sparklines, Category Shares, 50/30/20
│   │   ├── AnomalyDetector.jsx       # Interactive Anomaly Review Sentinel
│   │   ├── PatternAnalyzer.jsx       # Subscriptions, Zombie Finder & Day Patterns
│   │   ├── BudgetPlanner.jsx         # Pacing Envelopes & Dynamic Rebalancing
│   │   ├── ScenarioSimulator.jsx     # Interactive What-If Scenario Sandbox
│   │   ├── TransactionLedger.jsx     # Searchable, Filterable Double-Entry Table & CSV Export
│   │   ├── AddTransactionModal.jsx   # Real-Time AI Auto-Categorization Form
│   │   ├── StatementImportModal.jsx  # CSV Statement Parser & Auto Field Mapper
│   │   └── AICopilotDrawer.jsx       # Conversational AI Financial Advisor
│   ├── data\
│   │   └── mockData.js               # Dual Persona Datasets, Historical Transactions & Anomalies
│   ├── services\
│   │   ├── aiCategorizer.js          # NLP Keyword & Heuristic Classification
│   │   ├── anomalyEngine.js          # Z-Score, IQR, Duplicate & Velocity Detectors
│   │   ├── patternEngine.js          # Recurring Cadence & Behavioral Analytics
│   │   ├── budgetEngine.js           # Pacing, Rebalancing & Runway Formulas
│   │   └── aiAdvisorEngine.js        # Strategic Health Auditor & NL Query Engine
│   ├── App.jsx                       # Main Application State & Routing
│   ├── index.css                     # Tailwind CSS v4 & Styling
│   └── main.jsx                      # React 19 Root Entrypoint
├── tazim_ai_finance.py               # Standalone Python Financial Audit CLI
├── package.json                      # Dependencies & NPM Scripts
├── vite.config.js                    # Vite 8 & Tailwind Config
└── README.md                         # Architecture Documentation
```

---

## 🔒 Security & Privacy Notice
All financial computations, anomaly evaluations, and NLP classifications execute locally in-browser and on-device without leaking unencrypted financial credentials or personal transaction records to external untrusted servers.
