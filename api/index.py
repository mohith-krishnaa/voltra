"""
Vercel Serverless Entrypoint for Voltra FastAPI Application
"""
import sys
import os
import traceback

# Add all possible runtime paths to sys.path
for p in [
    os.getcwd(),
    os.path.dirname(os.path.abspath(__file__)),
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "/var/task"
]:
    if p and os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.app import app
except Exception as e:
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    app = FastAPI(title="Voltra Diagnostics")
    error_trace = traceback.format_exc()
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
    def catch_all(path_name: str):
        return JSONResponse({
            "status": "error",
            "message": "Python startup error on Vercel",
            "error": str(e),
            "traceback": error_trace
        }, status_code=500)
