@echo off
cd /d "%~dp0"

echo ========================================
echo   SOAS Feedback Collector
echo ========================================
echo.

REM Step 1: Check MongoDB
echo [1/4] Checking MongoDB connection...
powershell -Command "try { $c=New-Object MongoDB.Driver.MongoClient('mongodb://localhost:27017'); $d=$c.GetDatabase('feedback-collector'); $d.RunCommand([MongoDB.Bson.BsonDocument]::Parse('{ping:1}')); Write-Host '     MongoDB: Connected'; exit 0 } catch { Write-Host '     MongoDB: Not running'; exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo     WARNING: MongoDB not detected on localhost:27017
    echo     The server may fail to start if MongoDB is not running.
    timeout /t 3 /nobreak > nul
)

REM Step 2: Install dependencies if missing
echo [2/4] Checking dependencies...
if not exist "server\node_modules" (
    echo     Installing server dependencies...
    cd server
    call npm install
    cd ..
)
if not exist "client\node_modules" (
    echo     Installing client dependencies...
    cd client
    call npm install
    cd ..
)
echo     All dependencies are ready.

REM Step 3: Open browser
echo [3/4] Opening browser...
start http://localhost:5173

REM Step 4: Start both frontend + backend in ONE terminal using npm run dev
echo [4/4] Starting both frontend and backend...
echo.
echo ========================================
echo   Project is starting up...
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:5173
echo   Press Ctrl+C to stop everything
echo ========================================
echo.
cd /d "%~dp0"
call npm run dev

REM Cleanup after stopping (Ctrl+C)
echo.
echo Stopping services...
echo Done! Press any key to close.
pause >nul
