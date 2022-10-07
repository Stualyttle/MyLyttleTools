const fs = require("fs");

fs.writeFileSync("./version.txt", "0.0.0.0: ");

// Don't put this in git hooks, only for npm scripts.
fs.cp(
  "./.lyttle_tools/src/assets/git-hooks",
  "./.git/hooks",
  { recursive: true },
  (err) => {
    if (err) throw new Error("Version import to .git/hooks failed!" + err);
  }
);
