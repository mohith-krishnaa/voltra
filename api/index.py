"""
Vercel Serverless Python Entrypoint for Voltra FastAPI Application
"""
import sys
import os

# Ensure the root directory and backend directory are in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app import app

# Expose app for ASGI/WSGI serverless invocation on Vercel
