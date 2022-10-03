#!/usr/bin/env bash
# Check if .git exists
if [ -d "./.git" ] && [ ! -h "./.git" ]; then
  # Download latest
  curl -LO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip
  if not [ -d "./latest.zip" ]; then
    powershell -Command "Invoke-WebRequest https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip -OutFile latest.zip"
  fi
  # Unzip
  tar -xf ./latest.zip | powershell -command "Expand-Archive -Force ./latest.zip ./"
  # Remove zip
  rm ./latest.zip
  # Go to .lyttle_tools
  cd ./.lyttle_tools
  # Run install
  npm run install
else
  # Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
fi
