#!/bin/bash

# Set backup directory
BACKUP_DIR=pb_data_backup

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Kill PocketBase process to ensure clean backup
echo "Stopping PocketBase for backup..."
pkill pocketbase
sleep 2

# Get current date and time for filename
DATETIME=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="$BACKUP_DIR/pb_data_$DATETIME.zip"

# Create zip file of pb_data directory
echo "Creating backup..."
zip -r "$BACKUP_FILE" pb_data/

echo "Backup created at $BACKUP_FILE"

# Restart PocketBase
echo "Restarting PocketBase..."
./pocketbase serve &

echo "Done!" 