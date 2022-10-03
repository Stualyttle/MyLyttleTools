#!/usr/bin/env bash
# Check if .git exists
if [ -d "./.git" ] && [ ! -h "./.git" ]; then
    # Download latest
    curl -LO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip
    # Unzip
    tar -xf ./latest.zip
    # Remove zip
    rm ./latest.zip
    # Go to .lyttle_tools
    cd ./.lyttle_tools || (echo "Error: Could not find .lyttle_tools" && exit 1)
    # Run install
    npm run install
else
  # Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
fi