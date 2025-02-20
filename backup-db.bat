@echo off
echo Backing up PocketBase database...
if exist pb_data (
    xcopy /s /y pb_data\*.db pb_data_backup\ >nul
)
echo Backup complete! 