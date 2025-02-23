@echo off
echo Starting Nesiojami.lt Scraper...
echo.

REM Set Python path
set PYTHON_PATH=C:\Users\dromd\AppData\Local\Programs\Python\Python313\python.exe

REM Check if Python exists
if not exist "%PYTHON_PATH%" (
    echo Error: Python not found at %PYTHON_PATH%
    echo Please make sure Python 3.13 is installed.
    pause
    exit /b 1
)

REM Check if scraper exists
if not exist "scraper\nesiojami_scraper.py" (
    echo Error: Scraper file not found at scraper\nesiojami_scraper.py
    pause
    exit /b 1
)

echo Using Python from: %PYTHON_PATH%
echo.

REM Install Playwright browsers if not already installed
echo Checking Playwright browsers...
"%PYTHON_PATH%" -m playwright install
if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Failed to install Playwright browsers
    pause
    exit /b 1
)

echo.
echo Running scraper...
echo.

REM Run the scraper
"%PYTHON_PATH%" scraper/nesiojami_scraper.py

REM Check if there was an error
if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Scraper failed with error code %ERRORLEVEL%
    echo Please check the error messages above.
) else (
    echo.
    echo Scraper completed successfully!
)

echo.
echo Press any key to exit...
pause > nul 