"""
Smart Electricity Bill Predictor - Database Configuration
SQLite engine with thread-safe session factory and PostgreSQL compatibility.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_DB_PATH = os.path.join(DB_DIR, "bill_predictor.db")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{SQLITE_DB_PATH}")

# If SQLite, ensure same thread checking is relaxed
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI Dependency for database session lifecycle."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes tables."""
    Base.metadata.create_all(bind=engine)
