"""
Smart Electricity Bill Predictor - Security, Hashing & JWT Authentication
"""

import os
import datetime
from typing import Optional, Dict, Any
import bcrypt
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

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against stored bcrypt hash."""
    try:
        if not plain_password or not hashed_password:
            return False
        # Truncate to 72 bytes as required by bcrypt
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception as e:
        print(f"[Security] Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Generates bcrypt hash of password safely."""
    # Truncate to 72 bytes as required by bcrypt
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

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
