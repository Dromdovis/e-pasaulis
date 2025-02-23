#!/bin/bash

echo "Installing dependencies for E-Pasaulis..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed! Please install Python 3.9 or later."
    echo "For Ubuntu/Debian: sudo apt install python3"
    echo "For macOS: brew install python3"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed! Please install Node.js 18 or later."
    echo "For Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs"
    echo "For macOS: brew install node"
    exit 1
fi

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "Bun is not installed! Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    # Source the updated profile
    source ~/.bashrc
fi

echo "Installing Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -e .[dev]

echo "Installing Node.js dependencies..."
bun install

echo "Installing Playwright browsers..."
python3 -m playwright install

echo
echo "All dependencies have been installed successfully!"
echo
echo "To start the development server:"
echo "1. Start PocketBase: ./pocketbase serve"
echo "2. Start Next.js: bun dev"
echo "3. For scraping: ./run_scraper.sh"
echo 