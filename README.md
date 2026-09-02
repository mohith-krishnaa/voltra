# VoltCast — Smart Electricity Bill Predictor & Insights Engine

VoltCast is an electricity-bill forecasting and insights project that combines appliance-based usage estimates, progressive utility tariff calculations, daily tracking, explainability, and a What-If simulator.

**Live demo:** [voltra-iota.vercel.app](https://voltra-iota.vercel.app)

> **Evaluation boundary:** the forecasting model is trained from physics-grounded synthetic records. Reported metrics describe the model’s evaluation on that generated data; they are not a guarantee of accuracy for a household’s future bill. Record actual bills and compare them over time before treating the forecast as reliable.

## Feature surface

| Capability | Description |
|---|---|
| Monthly forecast | Estimates monthly kWh and bill amounts using a scikit-learn regression model |
| Tariff engine | Computes progressive slabs for supported tariff presets and itemizes energy, fixed, and duty charges |
| Explainability | Ranks appliance contribution using charts and tables |
| What-If simulator | Models changes such as appliance runtime adjustments and shows estimated bill or carbon differences |
| Daily tracking | Accepts daily readings and adapts the projection as the billing cycle progresses |
| Household history | Supports household or meter records and actual-bill capture for later validation |

## Architecture

```text
React frontend
   │
   ├── Monthly predictor
   ├── What-If simulator
   ├── Daily tracker and charts
   └── Household and alert views
   │
FastAPI backend
   ├── Authentication and users
   ├── Prediction and daily-log routes
   ├── Progressive tariff calculator
   ├── Adaptive forecast logic
   └── SQLite / PostgreSQL persistence
   │
Model and domain logic
   ├── Synthetic dataset generation
   ├── RandomForest regression
   └── Tariff, validation, and recommendation modules
```

## Repository structure

```text
.
├── backend/                 FastAPI application and domain routes
├── data/                    Dataset generation and training data
├── frontend/                React/Vite dashboard
├── model/                   Training scripts and serialized model
├── tests/                   Model, tariff, API, and auth tests
├── package.json             Frontend build shortcut
├── requirements.txt         Python dependencies
└── README.md
```

## Run locally

### Backend

From the repository root:

```bash
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell
# .venv\Scripts\Activate.ps1

pip install -r requirements.txt
python -m uvicorn backend.app:app --reload --port 8000
```

API documentation is available at `http://localhost:8000/docs` when the backend is running.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server is normally available at `http://localhost:5173`.

### Model training

If you need to regenerate the model, inspect the scripts in `data/` and `model/` first, then run the project’s dataset-generation and training commands in the documented order. Keep generated datasets and evaluation output clearly labeled as synthetic or validation data.

## Tests and build

```bash
pytest tests/ -v
npm run build
```

The repository includes tests for model behavior, tariffs, API behavior, and payment/auth flows. When extending the forecasting logic, add a fixture that compares a prediction against a known tariff or appliance scenario rather than relying only on an aggregate score.

## Data and safety notes

VoltCast is a planning and educational tool, not a utility bill guarantee or financial product. Tariffs vary by provider and change over time. Appliance wattage, weather multipliers, duty cycles, and synthetic assumptions can differ from real household behavior. The interface should surface the tariff preset, data timestamp, and synthetic-data boundary wherever a forecast is shown.

Do not commit production secrets, JWT keys, database credentials, or real household data. Use environment variables and keep local or generated data out of public commits unless it is intentionally anonymized and documented.

## Roadmap for stronger evidence

The most valuable next proof points are a reproducible train/evaluate command, baseline comparisons, error metrics on held-out synthetic records, a clearly labeled real-bill validation workflow, and a deployment checklist covering secrets, database migrations, and authentication configuration.

## License

See the repository for the applicable source-code license.

## Author

**Mohith Krishnaa** — [@mohith-krishnaa](https://github.com/mohith-krishnaa)
