@echo off
echo Installing Python dependencies...
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies. Make sure you have Python and pip installed.
    pause
    exit /b %ERRORLEVEL%
)

echo Starting the server...
uvicorn main:app --reload --host 0.0.0.0 --port 8000

if %ERRORLEVEL% NEQ 0 (
    echo Error starting the server.
    pause
)
