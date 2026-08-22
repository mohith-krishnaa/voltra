"""
Vercel Serverless Entrypoint for Voltra FastAPI Application
"""
import sys
import os

# Add root task directory, current directory, and working directory to sys.path
file_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(file_dir)
cwd = os.getcwd()

for p in [cwd, parent_dir, file_dir, "/var/task"]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

from backend.app import app
