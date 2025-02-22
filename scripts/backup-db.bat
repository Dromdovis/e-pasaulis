@echo off
setlocal

:: Set backup directory
set BACKUP_DIR=pb_data_backup

:: Create backup directory if it doesn't exist
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

:: Kill PocketBase process to ensure clean backup
echo Stopping PocketBase for backup...
taskkill /F /IM pocketbase.exe 2>nul
timeout /t 2 /nobreak >nul

:: Get current date and time for filename
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set BACKUP_FILE=%BACKUP_DIR%\pb_data_%datetime:~0,8%_%datetime:~8,6%.zip

:: Create zip file of pb_data directory
echo Creating backup...
powershell -Command "Compress-Archive -Path pb_data\* -DestinationPath '%BACKUP_FILE%' -Force"

echo Backup created at %BACKUP_FILE%

:: Restart PocketBase
echo Restarting PocketBase...
start "" pocketbase.exe serve

echo Done! You can close this window.
pause 