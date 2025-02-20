@echo off
setlocal

:: Check if pocketbase.exe exists
if not exist pocketbase.exe (
    echo Downloading PocketBase...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/pocketbase/pocketbase/releases/download/v0.25.1/pocketbase_0.25.1_windows_amd64.zip' -OutFile 'pocketbase.zip'"
    powershell -Command "Expand-Archive -Path 'pocketbase.zip' -DestinationPath '.'"
    del pocketbase.zip
)

:: Run PocketBase
pocketbase.exe serve 