const fs = require("fs");

const newVersion = fs.readFileSync(
  "./.lyttle_tools/config/breaking.config.json",
  "utf8"
);

fs.writeFileSync("./node_modules/breaking.config.json", newVersion);

console.log("Breaking config updated");
