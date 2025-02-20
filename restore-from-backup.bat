@echo off
setlocal

:: Set backup directory
set BACKUP_DIR=pb_data_backup

:: List available backups
echo Available backups:
dir /B /AD "%BACKUP_DIR%"

:: Ask user which backup to restore
set /p BACKUP_NAME="Enter backup name to restore: "

:: Stop PocketBase if it's running
taskkill /F /IM pocketbase.exe 2>nul
timeout /t 2 /nobreak >nul

:: Remove current data
rmdir /S /Q pb_data

:: Restore from backup
xcopy /E /I /Y "%BACKUP_DIR%\%BACKUP_NAME%" pb_data

:: Restart PocketBase
start "" pocketbase.exe serve

echo Restored from backup %BACKUP_NAME%
pause 