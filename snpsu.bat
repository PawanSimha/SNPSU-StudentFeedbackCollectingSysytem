@echo off
cd /d "%~dp0"

echo ========================================
echo   SOAS Feedback Collector
echo ========================================
echo.

REM Step 0: Kill orphaned process on port 5000
echo [0/5] Cleaning up stale processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 "') do (
    taskkill /f /pid %%a >nul 2>&1 && echo     Killed stale process on port 5000
)

REM Step 1: Check MongoDB
echo [1/5] Checking MongoDB connection...
cd server
node -e "require('mongoose').connect('mongodb://localhost:27017/feedback-collector').then(()=>{console.log('     MongoDB: Connected');process.exit(0)}).catch(()=>{console.log('     MongoDB: Not running');process.exit(1)})" 2>nul
if errorlevel 1 (
    echo     WARNING: MongoDB not detected on localhost:27017
    echo     The server may fail to start if MongoDB is not running.
    timeout /t 3 /nobreak > nul
)
cd /d "%~dp0"

REM Step 2: Install dependencies if missing
echo [2/5] Checking dependencies...
if not exist "server\node_modules" (
    echo     Installing server dependencies...
    cd server
    call npm install
    cd /d "%~dp0"
)
if not exist "client\node_modules" (
    echo     Installing client dependencies...
    cd client
    call npm install
    cd /d "%~dp0"
)
echo     All dependencies are ready.

REM Step 3: Start both frontend + backend in ONE terminal using npm run dev
echo [3/5] Starting both frontend and backend...
echo.
echo ========================================
echo   Project is starting up...
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:5173
echo   Press Ctrl+C to stop everything
echo ========================================
echo.
cd /d "%~dp0"
start http://localhost:5173

call npm run dev

REM Cleanup after stopping (Ctrl+C)
echo.
echo Stopping services...
echo Done! Press any key to close.
pause >nul
