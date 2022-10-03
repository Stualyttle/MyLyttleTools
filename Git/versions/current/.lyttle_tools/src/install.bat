title Installing LyttleTools Git...
:: check if git exists
if exist ./.git (
    :: Download latest
    curl -LO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip
    :: Unzip
    tar -xf ./latest.zip | powershell -command "Expand-Archive -Force ./latest.zip ./"
    :: Remove zip
    del .\latest.zip
    :: Go to .lyttle_tools
    cd ./.lyttle_tools || (echo "Error: Could not find .lyttle_tools" && exit 1)
    :: Run install & delete script
    npm run install & del ..\install.bat
) else (
  :: Not found, Mention it
  echo "No repository found! Is this the root? Is .git in this folder?"
  pause
)
