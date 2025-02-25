@echo off
echo Starting product image updater...
cd %~dp0
python run_image_updater.py
pause 