"""
Vercel Serverless Python Entrypoint for Voltra FastAPI Application
"""
import sys
import os

# Put current directory (api/) and root directory in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)

for p in [current_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.app import app
except Exception:
    try:
        from api.backend.app import app
    except Exception as e:
        import traceback
        from fastapi import FastAPI
        from fastapi.responses import JSONResponse

        app = FastAPI(title="Voltra Fallback")
        err_msg = traceback.format_exc()

        @app.get("/api/{full_path:path}")
        def fallback_error(full_path: str):
            return JSONResponse({"status": "error", "message": "Serverless boot error", "details": err_msg}, status_code=500)
