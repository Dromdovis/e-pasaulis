#!/bin/bash

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # For Unix
# .\venv\Scripts\activate  # For Windows

# Install dependencies
pip install -r requirements.txt

# Install playwright browsers
playwright install chromium

echo "Setup complete! Don't forget to update your .env file with your PocketBase credentials." 