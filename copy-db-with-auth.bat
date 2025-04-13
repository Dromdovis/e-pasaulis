@echo off
setlocal

:: Set destination directory for the copy
set COPY_DIR=pb_data_copy

:: Create destination directory if it doesn't exist
if not exist %COPY_DIR% mkdir %COPY_DIR%

:: Kill PocketBase process to ensure clean copy
echo Stopping PocketBase for database copy...
taskkill /F /IM pocketbase.exe 2>nul
timeout /t 2 /nobreak >nul

:: Create a directory copy of pb_data
echo Creating copy of database with all settings...
xcopy /E /I /H /Y pb_data %COPY_DIR%

:: Copy environment files containing Google auth credentials
echo Copying environment files with auth credentials...
copy .env %COPY_DIR%\.env
copy .env.local %COPY_DIR%\.env.local
copy .env.production %COPY_DIR%\.env.production 2>nul

:: Create a README file with instructions
echo Creating instruction file...
(
echo # Database Copy with Google Auth Credentials
echo.
echo This is a copy of the PocketBase database with all settings including Google authentication setup.
echo.
echo ## Contents:
echo - Complete database files from pb_data
echo - Environment files containing Google auth credentials
echo.
echo ## To Use This Copy:
echo 1. Replace your pb_data directory with this copy
echo 2. Copy the .env files to your project root
echo 3. Ensure your Google OAuth configuration in Google Cloud Console includes:
echo    - Client ID from .env files
echo    - Proper redirect URIs:
echo      * http://localhost:3000/auth/callback/google
echo      * http://127.0.0.1:8090/api/collections/users/auth-with-oauth2
) > %COPY_DIR%\README.md

echo.
echo Database copy with Google auth credentials created at %COPY_DIR%
echo.

:: Create zip file of the database copy
echo Creating zip file of the database copy...
set ZIP_FILE=db_with_auth_copy.zip

:: Delete previous zip file if it exists
if exist %ZIP_FILE% del %ZIP_FILE%

:: Use PowerShell to create the zip file
powershell -Command "Compress-Archive -Path '%COPY_DIR%\*' -DestinationPath '%ZIP_FILE%' -Force"
echo Zip file created: %ZIP_FILE%
echo.

:: Restart PocketBase
echo Restarting PocketBase...
start "" pocketbase.exe serve

echo Done! You can close this window.
pause 