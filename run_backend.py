import os
import sys
import uvicorn

if __name__ == "__main__":
    # Ensure current directory is on sys.path
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    if curr_dir not in sys.path:
        sys.path.insert(0, curr_dir)
        
    print("==================================================")
    print("  CLIPGENIUS AI - BACKEND SERVER")
    print("  URL: http://127.0.0.1:8000")
    print("  Docs: http://127.0.0.1:8000/docs")
    print("==================================================")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
