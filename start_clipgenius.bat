@echo off
title CLIPGENIUS AI - Launching Platform
color 0B

echo =====================================================================
echo                CLIPGENIUS AI - VIRAL SHORT GENERATOR
echo          Turn Every Long Video Into Viral 9:16 Shorts
echo =====================================================================
echo.

:: Check for Python
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Python not found on standard PATH, checking user directory...
    set "PATH=C:\Users\%USERNAME%\Python311;C:\Users\%USERNAME%\Python311\Scripts;%PATH%"
)

:: Start Backend
echo Starting FastAPI Backend server on http://127.0.0.1:8000 ...
start "ClipGenius AI - Backend Server" cmd /k "python run_backend.py"

:: Wait 3 seconds
timeout /t 3 /nobreak >nul

:: Start Frontend
echo Starting React Vite Frontend on http://localhost:5173 ...
cd frontend
start "ClipGenius AI - Frontend" cmd /k "npm.cmd run dev"
cd ..

echo.
echo =====================================================================
echo   CLIPGENIUS AI is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8000
echo =====================================================================
echo.
pause
