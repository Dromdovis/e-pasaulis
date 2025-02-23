@echo off
echo Installing dependencies for E-Pasaulis...

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed! Please install Python 3.9 or later.
    echo Download from: https://www.python.org/downloads/
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed! Please install Node.js 18 or later.
    echo Download from: https://nodejs.org/
    exit /b 1
)

:: Check if Bun is installed
bun --version >nul 2>&1
if errorlevel 1 (
    echo Bun is not installed! Installing Bun...
    powershell -Command "iwr https://bun.sh/install.ps1 -useb | iex"
)

echo Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install -e .[dev]

echo Installing Node.js dependencies...
bun install

echo Installing Playwright browsers...
python -m playwright install

echo.
echo All dependencies have been installed successfully!
echo.
echo To start the development server:
echo 1. Start PocketBase: .\pocketbase.exe serve
echo 2. Start Next.js: bun dev
echo 3. For scraping: .\run_scraper.bat
echo.
pause 