@echo off
title Installing LyttleTools Git...
:: check if git exists
if exist ./.git (
    :: Download latest
    curl -LO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/experimental.zip
    :: Unzip
    tar -xf ./experimental.zip | powershell -command "Expand-Archive -Force ./experimental.zip ./"
    :: Remove zip
    del .\experimental.zip
    :: Go to .lyttle_tools
    :: cd ./.lyttle_tools || (echo "Error: Could not find .lyttle_tools" && exit 1)
    :: Run install & delete script
    cd ./.lyttle_tools && npm run install
) else (
  :: Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
  pause
)
