"""
Smart Electricity Bill Predictor - Security, Hashing & JWT Authentication
Uses Python standard library hashlib (PBKDF2-SHA256) for zero-dependency native compatibility.
"""

from __future__ import annotations
import os
import datetime
import hashlib
import secrets
from typing import Optional, Dict, Any
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models_db import User

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "voltra_smart_electricity_secret_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

security_bearer = HTTPBearer(auto_error=False)

def get_password_hash(password: str) -> str:
    """Generates PBKDF2-SHA256 hash of password safely using standard library."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against stored hash."""
    try:
        if not plain_password or not hashed_password:
            return False
        if "$" in hashed_password:
            salt, stored_hash = hashed_password.split("$", 1)
            key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return secrets.compare_digest(key.hex(), stored_hash)
        return False
    except Exception as e:
        print(f"[Security] Password verification notice: {e}")
        return False

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Encodes JWT claims with expiration."""
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + (expires_delta or datetime.timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Retrieves authenticated user if valid token present, otherwise returns None."""
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    return user

def get_current_user_required(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> User:
    """Strictly requires a valid JWT token."""
    user = get_current_user_optional(credentials, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
