@echo off
title Installing LyttleTools Git...
:: check if git exists
if exist ./.git (
    :: Download latest
    curl -sSLO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/experimental.zip > nul
    :: Unzip
    tar -zxf ./experimental.zip > nul | powershell -command "Expand-Archive -Force ./experimental.zip ./" > nul
    :: Remove zip
    del .\experimental.zip > nul
) else (
  :: Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
  pause
)
