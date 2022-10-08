const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const { join } = require("path");

const isHook = false;
const rootDir = join(__dirname + "/..", "/..", "/..", "/..");

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
