"""
Smart Electricity Bill Predictor - Database Configuration
SQLite engine with thread-safe session factory, serverless /tmp compatibility, and PostgreSQL support.
"""

import os
import tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Check if running in serverless environment (Vercel, AWS Lambda) or read-only filesystem
is_serverless = bool(
    os.getenv("VERCEL") or 
    os.getenv("AWS_LAMBDA_FUNCTION_NAME") or 
    not os.access(os.path.dirname(os.path.abspath(__file__)), os.W_OK)
)

if is_serverless:
    SQLITE_DB_PATH = os.path.join(tempfile.gettempdir(), "bill_predictor.db")
else:
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
    """Initializes tables safely."""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[Database] init_db notice: {e}")
