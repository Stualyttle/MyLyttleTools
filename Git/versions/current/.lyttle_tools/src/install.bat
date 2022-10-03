title Installing LyttleTools Git...

curl -LO https://github.com/Stualyttle/LyttleTools/raw/main/Git/versions/latest.zip
tar -xf ./latest.zip | powershell -command "Expand-Archive -Force ./latest.zip ./"
cd ./.lyttle_tools
del ..\latest.zip
npm run install & del ..\install.bat
