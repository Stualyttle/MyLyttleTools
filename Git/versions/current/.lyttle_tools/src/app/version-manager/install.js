import fs from "fs";

fs.cp(
  "./.lyttle_tools/src/assets/version-manager/version.txt",
  "./version.txt",
  { recursive: true },
  (err) => {
    if (err) throw new Error("Version import to .git/hooks failed!" + err);
  }
);
