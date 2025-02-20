@echo off
setlocal

:: Kill any running PocketBase process
taskkill /F /IM pocketbase.exe 2>nul
:: Wait a moment for the process to fully terminate
timeout /t 2 /nobreak >nul

:: Restore database with superadmin account
call restore-db.bat

echo Starting PocketBase...
start "" pocketbase.exe serve

echo Waiting for PocketBase to start...
timeout /t 5 /nobreak >nul

echo Populating database...
bun run populate

echo Database reset and population complete!
echo You can close this window and continue using the application.
pause 