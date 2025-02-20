@echo off
setlocal

:: Stop PocketBase if running
taskkill /F /IM pocketbase.exe 2>nul
timeout /t 2 /nobreak >nul

:: Create production package directory
set PACKAGE_DIR=production_package
if exist "%PACKAGE_DIR%" rmdir /S /Q "%PACKAGE_DIR%"
mkdir "%PACKAGE_DIR%"

:: Copy production data
xcopy /E /I /Y pb_data "%PACKAGE_DIR%\pb_data"

:: Copy environment files (if they exist)
if exist .env copy .env "%PACKAGE_DIR%\"

:: Create zip file with timestamp
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set ZIP_NAME=production_data_%timestamp%.zip

:: Create zip (requires 7-Zip)
"C:\Program Files\7-Zip\7z.exe" a "%ZIP_NAME%" "%PACKAGE_DIR%\*"

:: Cleanup
rmdir /S /Q "%PACKAGE_DIR%"

:: Restart PocketBase
start "" pocketbase.exe serve

echo Production package created: %ZIP_NAME%
pause 