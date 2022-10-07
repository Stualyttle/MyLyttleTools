const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");

const version = "v2.2.0";

fs.readFile("./.lyttle_tools/config/app.config.json", (err, content) => {
  if (err) return;
  const config = JSON.parse(content);

  // console.log(config);

  function runCommand(command) {
    try {
      const res = execSync(command, { stdio: "pipe" });
      return [res, true];
    } catch (_) {
      return [null, false];
    }
  }

  if (config.autoUpdate) {
    const [res, success] = runCommand(
      "curl -L https://raw.githubusercontent.com/Stualyttle/LyttleTools/main/Git/versions/latest.txt"
    );

    const cloudVersion = res.toString().trim();

    if (cloudVersion !== version) {
      const isWin = os.platform() === "win32";
      if (isWin)
        runCommand(
          "curl -sSL https://install-git.lyttle.it/bat | cmd.exe > nul"
        );
      else
        runCommand(
          "curl -sSL https://install-git.lyttle.it/sh | bash > /dev/null"
        );
    }
  }

  const [_, breakingCheck] = runCommand(
    "node ./.lyttle_tools/src/app/breaking/check.js"
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
});
