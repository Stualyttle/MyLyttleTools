const fs = require("fs");
const dir = "./node_modules";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const newVersion = fs.readFileSync(
  "./.lyttle_tools/config/breaking.config.json",
  "utf8"
);

fs.writeFileSync("./node_modules/breaking.config.json", newVersion);

console.log("Breaking config updated");
