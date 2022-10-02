#!/usr/bin/env bash
# Check if .git exists
if [ -d "./.git" ] && [ ! -h "./.git" ]; then
  # Mention it
  echo "Git repository found, .git is a directory!"
  # Check operation system
  if [ "$(uname)" == "Darwin" ] || [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Mention it
    echo "Running instalation for Linux or Mac OS X"
    # Download latest
    curl -LO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip
    # Unzip
    tar -xf ./latest.zip
    # Remove zip
    rm ./latest.zip
    # Go to .lyttle_tools
    cd ./.lyttle_tools
    # Run install
    npm run install
  elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    # Mention it
    echo "Running instalation for MS Windows"
    # Download latest
    curl -LO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip
    # Unzip
    tar -xf ./latest.zip
    # Remove zip
    del ./latest.zip
    # Go to .lyttle_tools
    cd ./.lyttle_tools
    # Run install
    npm run install
  fi
else
  # Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
fi
