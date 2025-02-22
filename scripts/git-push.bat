@echo off
echo Preparing repository for git push...

:: 1. Remove pb_data from git tracking
echo Removing pb_data from git tracking...
git rm -r --cached pb_data 2>nul
git rm -r --cached pb_data_backup 2>nul

:: 2. Create backup
echo Creating database backup...
call backup-db.bat

:: 3. Stage changes
echo Staging changes...
git add .
git status

:: 4. Prompt for commit message
set /p COMMIT_MSG="Enter commit message: "

:: 5. Commit and push
echo Committing changes...
git commit -m "%COMMIT_MSG%"

echo Pushing to remote...
git push

echo Done! Repository updated successfully.
pause 