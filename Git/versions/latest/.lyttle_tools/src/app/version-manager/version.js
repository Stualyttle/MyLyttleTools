// Import filesystem
const fs = require("fs");
const os = require("os");
const { join } = require("path");
const { execSync } = require("child_process");

const isHook = false;
const rootDir = join(__dirname, "../", "../", "../", "../");

fs.readFile(
  rootDir + "/.lyttle_tools/config/app.config.json",
  "utf8",
  (err, content) => {
    if (err) return;
    const config = JSON.parse(content);

    function runCommand(command) {
      try {
        const res = execSync(command, { stdio: "pipe" });
        return [res, true];
      } catch (_) {
        return [null, false];
      }
    }

    if (config.autoUpdate) {
      const [rawCloudVersion] = runCommand(
        "curl -L https://raw.githubusercontent.com/Stualyttle/LyttleTools/main/Git/versions/latest.txt"
      );

      const cloudVersion = parseInt(
        rawCloudVersion.toString().replaceAll("_", "")
      );
      const appVersion = parseInt(config.ref.toString().replaceAll("_", ""));

      if (cloudVersion !== appVersion && cloudVersion > appVersion) {
        const versionBuilder = (n, i) => {
          if (n == 0 && ![0, 3, 6].includes(i)) return "";
          if (i === 6) return n;
          return n + ".";
        };
        const appVer = appVersion
          .toString()
          .split("")
          .map(versionBuilder)
          .join("");
        const cloudVer = cloudVersion
          .toString()
          .split("")
          .map(versionBuilder)
          .join("");
        const isWin = os.platform() === "win32";
        console.log(
          "\x1b[36m" +
            `Info: Updating tools from ${appVer} to ${cloudVer}, using script for the ` +
            `${isWin ? "Windows" : "MacOS/Linux"} platform` +
            "\x1b[0m"
        );
        if (isWin)
          runCommand(
            "curl -sSL https://install-git.lyttle.it/bat | cmd.exe > nul"
          );
        else
          runCommand(
            "curl -sSL https://install-git.lyttle.it/sh | bash > /dev/null"
          );

        config.ref = rawCloudVersion.toString().split("\n")[0];
        fs.writeFile(
          rootDir + "/.lyttle_tools/config/app.config.json",
          JSON.stringify(config, null, 2),
          "utf8",
          () => {}
        );

        if (!isHook) {
          fs.cp(
            rootDir + "/.lyttle_tools/src/assets/git-hooks",
            "./.git/hooks",
            { recursive: true },
            (err) => {
              if (err)
                throw new Error("Version import to .git/hooks failed!" + err);

              if (!isWin) {
                runCommand(`cd "${rootDir}" && chmod ug+x ./.git/hooks/*`);
              }
            }
          );
        }
      } else if (cloudVersion < appVersion) {
        console.log(
          "\x1b[33m" +
            "Warning: You are using a experimental or newer version than latest! Report any bugs you found!" +
            "\x1b[0m"
        );
      }
    }

    const [_, breakingCheck] = runCommand(
      `node "${rootDir}/.lyttle_tools/src/app/breaking/check.js"`
    );
    if (!breakingCheck) {
      console.log(
        "\x1b[31m" +
          '‼   Breaking changes detected! Please delete "./node_modules" & "./dist", run "npm i" and then "npm run tools:breaking:accept"' +
          "\x1b[0m"
      );
      process.exit(1);
    }

    const [nodeCheck] = runCommand("node -v");
    const yourNodeVer = nodeCheck.toString().trim();
    if (config.lockNode && yourNodeVer !== config.nodeVersion) {
      console.log(
        "\x1b[31m" +
          "‼   You are using a wrong nodejs version, You are currently using " +
          "\x1b[33m" +
          yourNodeVer +
          "\x1b[31m" +
          " but you should be using " +
          "\x1b[32m" +
          config.nodeVersion +
          "\x1b[31m" +
          "." +
          "\x1b[0m"
      );
      process.exit(1);
    }
  }
);

//////////////////////////////////////////////////////////////////////////////

// Don't put this in git hooks, only for npm scripts.
if (!isHook)
  fs.cp(
    rootDir + "/.lyttle_tools/src/assets/git-hooks",
    "./.git/hooks",
    { recursive: true },
    (err) => {
      if (err) throw new Error("Version import to .git/hooks failed!" + err);
    }
  );

// Get version in saved file
fs.readFile(rootDir + "/version.txt", "utf8", (err, data) => {
  // If error, throw error
  if (err) throw new Error("Pre-commit hook failed");

  function updateVersion(newTxtVersion) {
    // Change version in saved file
    fs.writeFileSync("./version.txt", newTxtVersion);

    // Notify user
    console.log(
      "Updated from",
      "\x1b[31m" + data.split(":")[0],
      "\x1b[0m" + "to",
      "\x1b[32m" + newTxtVersion.split(":")[0] + "\x1b[0m" + "!"
    );
  }

  // Split up version to update it.
  const version = data.split(":")[0];
  const v = version.split(".");

  // Desctructure version
  let [major, minor, patch, revision] = v;
  revision++;

  // Check version: Get day
  const today = new Date();

  // Get year
  const year = String(today.getFullYear()).slice(-2);

  // Create new date for week calculation.
  const tempToday = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  // Make Sunday's day number 7
  tempToday.setUTCDate(
    tempToday.getUTCDate() + 4 - (tempToday.getUTCDay() || 7)
  );
  // Get first day of year
  const yearStart = new Date(Date.UTC(tempToday.getUTCFullYear(), 0, 1));
  // Calculate full weeks to the nearest Sunday
  const week = String(Math.ceil(((tempToday - yearStart) / 86400000 + 1) / 7));
  // Return array of year and week number

  // Get day
  const days = [7, 1, 2, 3, 4, 5, 6];
  const day = String(days[today.getDay()]);

  if (year !== major || week !== minor || day !== patch) {
    // Setup version
    const ver = `${year}.${week}.${day}.1: `;
    updateVersion(ver);
    throw new Error("Invalid version, try again!");
  }

  // Update version
  const newVersion = `${major}.${minor}.${patch}.${revision}: `;
  updateVersion(newVersion);
});
