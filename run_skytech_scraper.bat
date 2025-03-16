@echo off
echo Starting SkyTech Desktop Scraper...
echo.

REM Set Python path to use system Python
set PYTHON_PATH=python.exe

REM Check if scraper exists
if not exist "scraper\nesiojami_scraper.py" (
    echo Error: Scraper file not found at scraper\nesiojami_scraper.py
    pause
    exit /b 1
)

echo Using system Python
echo.

REM Install required packages
echo Installing required packages...
"%PYTHON_PATH%" -m pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Failed to install required packages
    pause
    exit /b 1
)

REM Install Playwright browsers if not already installed
echo Installing Playwright browsers...
"%PYTHON_PATH%" -m playwright install
if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: Failed to install Playwright browsers
    pause
    exit /b 1
)

echo.
echo Running SkyTech desktop scraper...
echo.

REM Run the scraper with SkyTech and desktops parameters
"%PYTHON_PATH%" -c "import asyncio; from scraper.nesiojami_scraper import SkyTechScraper; asyncio.run(SkyTechScraper(category_type='desktops').scrape_products())"

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