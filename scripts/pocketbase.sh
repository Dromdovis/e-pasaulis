#!/bin/bash

# Make the script executable if it isn't already
chmod +x pocketbase.sh

# Check if pocketbase exists
if [ ! -f "pocketbase" ]; then
    echo "Downloading PocketBase..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.25.1/pocketbase_0.25.1_darwin_amd64.zip -o pocketbase.zip
    else
        # Linux
        curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.25.1/pocketbase_0.25.1_linux_amd64.zip -o pocketbase.zip
    fi
    unzip pocketbase.zip
    rm pocketbase.zip
    chmod +x pocketbase
fi

# Run PocketBase
./pocketbase serve 