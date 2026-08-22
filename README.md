# ⚡ VoltCast - Smart Electricity Bill Predictor & Insights Engine

> **AI-powered electricity bill forecasting, slab-based utility tariff calculations, daily adaptive tracking, and What-If simulator.**

---

## 🌟 The Problem & Human Need
People have no idea what their electricity bill will be until it arrives in the mailbox — by then it's too late to do anything about it. Heavy AC use during a heatwave, guests staying over, or inefficient water heaters result in nasty financial surprises.

**VoltCast solves this by predicting your electricity bill before it arrives**, explaining exactly which appliance is driving it up, and adapting day-by-day so you can course-correct before the billing cycle closes.

---

## 🚀 Key Features

1. **AI Monthly Forecast**:
   - High-accuracy Scikit-Learn `RandomForestRegressor` ($R^2 \approx 0.97$) estimating monthly kWh and bill amounts ($₹$).
   - Grounded in realistic appliance wattages, seasonal weather multipliers, inverter duty cycles, and standby losses.

2. **Progressive Slab-Based Tariff Engine**:
   - Computes realistic utility bills using tiered progressive slabs (TNEB, BESCOM, MSEDCL, Generic Standard, and Green Tariffs).
   - Itemized receipts showing base energy charges, fixed meter charges, and state electricity duties.

3. **Appliance Breakdown & Explainability**:
   - Visual Doughnut, Bar, and Table charts ranking power consumption (e.g. *"Your AC is 48% of your bill"*).

4. **Live "What-If" Simulator**:
   - Drag sliders in real-time to simulate behavioral modifications (e.g. reducing AC runtime by 2 hrs or upgrading to BLDC fans) and see immediate monthly and annual $₹$ savings and carbon offset ($\text{kg CO}_2$).

5. **Daily Usage Tracking & Adaptive Forecast**:
   - Log daily meter or appliance readings.
   - 5-to-7 day exponentially weighted rolling projection that adapts as the month goes on.
   - 30-Day Month-To-Date (MTD) vs Target Budget trajectory curve.

6. **Mid-Month Overage Warnings**:
   - Automated alerts if current pace exceeds budget threshold (e.g. $+25\%$ pace warning) with immediate recovery tips.

7. **Multi-Household & Historical Trust Validation**:
   - Track multiple homes or meters.
   - Record actual physical utility bills when they arrive to verify model accuracy over time.

8. **1-Click Judge / Demo Presets**:
   - Instant 1-click test personas for presentations:
     - 🔥 2BHK Summer Surge (Heavy AC)
     - 🌱 1BHK Eco Minimalist
     - 💻 3BHK Work-From-Home Techie
     - ⚡ Luxury Villa with EV

---

## 🛠️ Architecture & Tech Stack

```
bill-predictor/
├── data/
│   ├── generate_dataset.py       # Physics-grounded synthetic generator (12,000+ records)
│   └── electricity_data.csv      # Historical training dataset
├── model/
│   ├── train_model.py            # RandomForest ML regression trainer
│   ├── train_daily_model.py      # Short-term adaptive rolling forecaster
│   └── bill_model.joblib         # Serialized ML pipeline & scaler
├── backend/
│   ├── app.py                    # FastAPI entrypoint + startup seeding
│   ├── database.py               # SQLite / PostgreSQL SQLAlchemy engine
│   ├── models_db.py              # User, Household, DailyLog, Alert models
│   ├── tariff.py                 # Multi-tier progressive slab calculator
│   ├── recommendations.py        # Tailored savings advice engine
│   ├── adaptive.py               # 5-day rolling MTD budget pace monitor
│   ├── routes/
│   │   ├── auth.py               # JWT authentication & bcrypt hashing
│   │   ├── predict.py            # Monthly & What-If prediction endpoints
│   │   ├── daily_log.py          # Daily readings CRUD & forecast
│   │   ├── alerts.py             # Mid-month pace notifications
│   │   └── households.py         # Multi-meter management
│   └── utils/
│       ├── security.py           # Token encoding/decoding
│       └── validation.py         # Physical bounds sanitization
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React Dashboard
│   │   ├── components/           # MonthlyPredictor, WhatIfSimulator, DailyTracker, etc.
│   │   └── index.css             # Tailwind & Glassmorphism design system
│   ├── package.json
│   └── vite.config.js
└── tests/
    ├── test_model.py             # ML pipeline tests
    ├── test_tariff.py            # Progressive slab unit tests
    └── test_api.py               # FastAPI integration tests
```

---

## 💻 Quick Start & Running Locally

### 1. Backend Setup & Training
```bash
# Clone or navigate to the directory
cd C:\Users\JAGAN\.gemini\antigravity\scratch\bill-predictor

# Install dependencies
pip install -r requirements.txt

# Generate synthetic dataset and train ML model
python data/generate_dataset.py
python model/train_model.py

# Launch FastAPI backend server
python -m uvicorn backend.app:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
- Frontend UI: `http://localhost:5173`

---

## 🧪 Running Automated Tests
```bash
cd C:\Users\JAGAN\.gemini\antigravity\scratch\bill-predictor
pytest tests/ -v
```
