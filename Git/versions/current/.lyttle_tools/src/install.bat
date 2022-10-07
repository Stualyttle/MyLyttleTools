@echo off
title Installing LyttleTools Git...
:: check if git exists
if exist ./.git (
    :: Download latest
    curl -sSLO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip > nul
    :: Unzip
    tar -zxf ./latest.zip > nul | powershell -command "Expand-Archive -Force ./latest.zip ./" > nul
    :: Remove zip
    del .\latest.zip > nul
) else (
  :: Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
  pause
)
