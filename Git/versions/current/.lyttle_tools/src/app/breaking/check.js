const fs = require("fs");

function breakingError() {
  console.log(
    'Breaking changes detected! Please delete "./node_modules" & "./dist", then run "npm i" and after that run "npm run tools:breaking:accept"'
  );
  throw new Error(
    '\n\nBreaking changes detected! \nPlease delete "./node_modules" & "./dist", \nthen run "npm i" \nand after that run "npm run tools:breaking:accept"\n\n'
  );
}

function checkForBreakingChanges() {
  let lastBreakingChanges = null;
  let currentBreakingChanges = null;

  try {
    lastBreakingChanges = fs.readFileSync(
      "./.lyttle_tools/config/breaking.config.json",
      "utf8"
    );
    currentBreakingChanges = fs.readFileSync(
      "./node_modules/breaking.config.json",
      "utf8"
    );
  } catch (e) {
    breakingError();
  }

  if (
    lastBreakingChanges !== currentBreakingChanges ||
    (!lastBreakingChanges && !currentBreakingChanges)
  )
    breakingError();
  else console.log("No breaking changes detected");
}

checkForBreakingChanges();
