@echo off
echo Restoring PocketBase database...
if exist pb_data_backup (
    xcopy /s /y pb_data_backup\*.db pb_data\ >nul
)
echo Restore complete! 