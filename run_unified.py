import os
import sys
import subprocess
import time
import signal

def run_unified():
    print("==================================================================")
    print("             CLIPGENIUS AI - UNIFIED LOCAL SERVICE                ")
    print("==================================================================")
    print("  Starting unified full-stack service (Backend + Frontend)...     ")
    print("==================================================================")

    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    python_exe = sys.executable

    # 1. Start FastAPI Backend Server
    backend_cmd = [python_exe, "run_backend.py"]
    print("[1/2] Starting Backend API on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(backend_cmd, cwd=root_dir)

    # Wait briefly for backend to initialize
    time.sleep(2)

    # 2. Start Frontend Vite Dev Server
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_cmd = [npm_cmd, "run", "dev"]
    print("[2/2] Starting Frontend UI on http://localhost:5173 ...")
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    print("\n>>> UNIFIED SERVICE IS LIVE!")
    print(">>> Frontend Application: http://localhost:5173")
    print(">>> Backend REST API:    http://127.0.0.1:8000")
    print(">>> API Swagger Docs:    http://127.0.0.1:8000/docs")
    print(">>> Press CTRL+C to stop both services.\n")

    def handle_exit(signum, frame):
        print("\nShutting down unified services...")
        try:
            frontend_proc.terminate()
        except Exception:
            pass
        try:
            backend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, handle_exit)

    try:
        # Keep alive while either process is running
        while True:
            b_poll = backend_proc.poll()
            f_poll = frontend_proc.poll()
            if b_poll is not None and f_poll is not None:
                break
            time.sleep(1)
    except KeyboardInterrupt:
        handle_exit(None, None)

if __name__ == "__main__":
    run_unified()
