import fs from "fs";

fs.writeFileSync(
  "./.lyttle_tools/src/assets/version-manager/version.txt",
  "0.0.0.0: "
);

console.log("Version Installed");
