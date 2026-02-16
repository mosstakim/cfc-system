#!/bin/bash
set -e
cd /home/jo/.gemini/antigravity/scratch/cfc_system

# Remove existing .git to start fresh if needed (optional, but safer for "reset")
rm -rf .git

git init
git add .
git commit -m "Initial commit of CFC System"
git branch -M main
git remote add origin https://github.com/mosstakim/cfc-system.git

echo "Git repository initialized and committed successfully."
echo "Remote configured to: https://github.com/mosstakim/cfc-system.git"
git log -1
