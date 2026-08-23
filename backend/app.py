"""
Smart Electricity Bill Predictor - FastAPI Main Application Entrypoint
"""

import os
import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from backend.database import init_db, SessionLocal
from backend.models_db import Household, DailyLog, Alert
from backend.routes.auth import router as auth_router
from backend.routes.predict import router as predict_router
from backend.routes.daily_log import router as daily_log_router
from backend.routes.alerts import router as alerts_router
from backend.routes.households import router as households_router
from backend.routes.payment import router as payment_router, solar_router

def seed_initial_demo_data():
    """Seeds default demo household and 14 days of realistic daily logs if database is fresh."""
    try:
        db = SessionLocal()
        try:
            hh_count = db.query(Household).count()
            if hh_count == 0:
                demo_hh = Household(
                    id=1,
                    user_id=1,
                    name="2BHK Family Home (Demo)",
                    house_type="Apartment-2BHK",
                    area_sqft=1150.0,
                    occupants=4,
                    tariff_zone="TGSPDCL-Telangana",
                    monthly_budget_inr=3200.0,
                    monthly_budget_units=350.0
                )
                db.add(demo_hh)
                db.commit()
                db.refresh(demo_hh)

                # Generate 14 days of logs
                today = datetime.date.today()
                start_date = today.replace(day=1)
                
                for d in range(1, 15):
                    log_date = (start_date + datetime.timedelta(days=d-1)).strftime("%Y-%m-%d")
                    daily_kwh = round(10.5 + (d % 3) * 0.8, 1) if d <= 7 else round(16.5 + (d % 4) * 1.2, 1)
                        
                    log = DailyLog(
                        household_id=demo_hh.id,
                        date=log_date,
                        daily_kwh=daily_kwh,
                        appliances_json='{"ac": {"count": 2, "hours": 8.0}, "fan": {"count": 4, "hours": 12.0}}',
                        notes="Heatwave surge" if d > 7 else "Normal weekday"
                    )
                    db.add(log)
                    
                alert = Alert(
                    household_id=demo_hh.id,
                    date=today.strftime("%Y-%m-%d"),
                    alert_type="OVERAGE_WARNING",
                    title="⚠️ Mid-Month AC Overage Warning (+26% Pace)",
                    message="Your last 7 days averaged 17.8 kWh/day due to heavy AC runtime. You are on track for 438 kWh (~₹3,720), exceeding your ₹3,200 budget. Reducing AC by 2 hrs/day will bring you back on budget.",
                    severity="danger",
                    projected_bill=3720.0,
                    budget_amount=3200.0
                )
                db.add(alert)
                db.commit()
        finally:
            db.close()
    except Exception as e:
        print(f"[Database] Safe seed notice: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        init_db()
        seed_initial_demo_data()
    except Exception as e:
        print(f"[Lifespan notice]: {e}")
    yield

app = FastAPI(
    title="Voltra AI - Smart Electricity Bill Predictor API",
    description="AI-powered electricity bill forecasting with 22+ appliances, official TGSPDCL/State tariff calculations, daily adaptive tracking, and What-If simulator.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(daily_log_router)
app.include_router(alerts_router)
app.include_router(households_router)
app.include_router(payment_router)
app.include_router(solar_router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()}

# Serve compiled frontend assets if available locally
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(FRONTEND_DIST) and os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # Don't intercept API routes or docs
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "app": "Voltra Smart Electricity Bill Predictor API",
            "status": "online",
            "docs_url": "/docs"
        }
