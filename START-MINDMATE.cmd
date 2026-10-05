@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22 or later, then reopen this launcher.
  pause
  exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<22)process.exit(1)"
if errorlevel 1 (
  echo MindMate requires Node.js 22 or later.
  pause
  exit /b 1
)
if not exist ".env" if exist ".env.example" copy /y ".env.example" ".env" >nul
 echo Starting MindMate. Keep this window open.
 echo Open the address printed below. Press Ctrl+C to stop.
node start.js
if errorlevel 1 (
  echo Startup failed. Read the error above.
  echo If the port is busy, close the other app or set PORT=3041 in .env.
  pause
  exit /b 1
)
endlocal
