#!/usr/bin/env bash
# Check if .git exists
if [ -d "./.git" ] && [ ! -h "./.git" ]; then
    # Download latest
    curl -sSLO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip > /dev/null
    # Unzip
    tar -zxf ./latest.zip > /dev/null
    # Remove zip
    rm ./latest.zip > /dev/null
else
  # Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
fi
