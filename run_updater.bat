@echo off
echo Starting product image updater...

set PYTHON_PATH=C:\Users\dromd\AppData\Local\Programs\Python\Python313\python.exe

echo Using Python at: %PYTHON_PATH%
"%PYTHON_PATH%" scripts/update_product_images.py

if errorlevel 0 (
    echo Script executed successfully!
) else (
    echo Script execution failed with error code: %errorlevel%
)

echo Product image update process completed!
pause 