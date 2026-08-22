"""
Vercel Serverless Python Entrypoint for Voltra FastAPI Application
"""
import sys
import os

# Ensure the root directory is on the python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import app

# Vercel looks for the ASGI/WSGI app instance
app = app
