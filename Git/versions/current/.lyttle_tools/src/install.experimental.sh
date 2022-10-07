#!/usr/bin/env bash
# Check if .git exists
if [ -d "./.git" ] && [ ! -h "./.git" ]; then
    # Download latest
    curl -sSLO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/experimental.zip
    # Unzip
    tar -zxf ./experimental.zip > /dev/null
    # Remove zip
    rm ./experimental.zip
    # Go to .lyttle_tools
    # cd ./.lyttle_tools || (echo "Error: Could not find .lyttle_tools" && exit 1)
    # Run install
    # npm run -s install
else
  # Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
fi
