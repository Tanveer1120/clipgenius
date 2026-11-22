@echo off
title CLIPGENIUS AI - Unified Service
color 0B

echo =====================================================================
echo                CLIPGENIUS AI - UNIFIED SERVICE
echo          Turn Every Long Video Into Viral 9:16 Shorts
echo =====================================================================
echo.

:: Check for Python
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Python not found on standard PATH, checking user directory...
    set "PATH=C:\Users\%USERNAME%\Python311;C:\Users\%USERNAME%\Python311\Scripts;%PATH%"
)

:: Run unified service (Backend + Frontend together)
python run_unified.py

pause
