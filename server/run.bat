@echo off

cd /d "%~dp0\.."

set PYTHONPATH=%CD%;%CD%\server

uvicorn server.app.main:app --reload --port 8000