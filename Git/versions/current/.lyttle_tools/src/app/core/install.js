const { execSync } = require("child_process");
const fs = require("fs");

function runCommand(command) {
  try {
    return execSync(command, { stdio: "pipe" });
  } catch (_) {
    return null;
  }
}

const check = async () => {
  return new Promise((resolve) => {
    function keyListener(key) {
      const byteArray = [...key];
      if (byteArray.length > 0 && byteArray[0] === 3) {
        console.log(
          "\x1b[31m" +
            '❌   We detected keypress "CTRL+C". Exiting process...' +
            "\x1b[0m"
        );
        process.exit(1);
      }
      const pressed = key.toString().toLowerCase();
      if (["y", "n"].includes(pressed)) {
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.stdin.off("data", keyListener);
        process.stdin.pause();
        resolve(pressed === "y");
      }
    }

    process.stdin.resume();
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on("data", keyListener);
  });
};

const yesAndNo =
  "\x1b[0m" +
  "(" +
  "\x1b[32m" +
  "y" +
  "\x1b[0m" +
  "/" +
  "\x1b[31m" +
  "n" +
  "\x1b[0m" +
  ")";

fs.readFile("./config/app.config.json", (err, content) => {
  async function installer() {
    try {
      if (err) return;
      const config = JSON.parse(content);
      console.log(
        `\nWelcome to Lyttle Tools!\n\n` +
          `This is a tool to help you manage your projects.\n` +
          `Lets go thru the installation config together!\n`
      );
      console.log(
        "\x1b[35m" + "[1/3]",
        "\x1b[0m" +
          "\x1b[1m" +
          "Can we install the installer script into your current package.json?",
        yesAndNo
      );
      console.log(
        "\x1b[36m" +
          "Info: You can still core it yourself if you want to do that later!" +
          "\x1b[0m"
      );
      const appInPackage = await check();

      console.log(
        "\x1b[35m" + "[2/3]",
        "\x1b[0m" +
          "\x1b[1m" +
          "Want to lock the node version for this project?",
        yesAndNo
      );
      console.log(
        "\x1b[33m" +
          "Warning: This needs the package.json to be core correctly!" +
          "\x1b[0m"
      );
      const lockNode = await check();

      console.log(
        "\x1b[35m" + "[3/3]",
        "\x1b[0m" + "\x1b[1m" + "Do you want to auto install updates?",
        yesAndNo
      );
      const autoUpdate = await check();

      console.log(
        "\x1b[1m" + "\n❓   Are you sure we can do these handlings below?",
        yesAndNo
      );

      const appInPackageMsg = appInPackage
        ? "\x1b[32m" +
          "✔   We WILL copy parts from our tempate into your package.json" +
          "\x1b[0m"
        : "\x1b[31m" + "❌   We will NOT touch your package.json" + "\x1b[0m";
      const lockNodeMsg = lockNode
        ? "\x1b[32m" +
          "✔   We WILL enable node version locking, and set it to your version! (you can still change this)" +
          "\x1b[0m"
        : "\x1b[31m" +
          "❌   We will NOT enable node version locking" +
          "\x1b[0m";
      const autoUpdateMsg = autoUpdate
        ? "\x1b[32m" + "✔   We WILL enable auto updates" + "\x1b[0m"
        : "\x1b[31m" + "❌   We will NOT enable auto updates" + "\x1b[0m";
      console.log(appInPackageMsg);
      console.log(lockNodeMsg);
      console.log(autoUpdateMsg);

      const correct = await check();

      if (!correct) {
        console.log(
          "\x1b[36m" +
            "Info: Installer has been closed, nothing has been installed (only the .lyttle_tools folder has been downloaded)" +
            "\x1b[0m"
        );
        return process.exit(1);
      }

      const nodeVersion = lockNode
        ? runCommand("node -v").toString().trim()
        : null;

      const newConfig = {
        ...config,
        appInPackage,
        lockNode,
        nodeVersion,
        autoUpdate,
      };

      fs.writeFile(
        "config/app.config.json",
        JSON.stringify(newConfig, null, 2),
        "utf8",
        () => {}
      );

      console.log("\x1b[32m" + "✔   Config created!\n" + "\x1b[0m");
      console.log("Installing Lyttle Tools:");

      console.log("\x1b[35m" + "[1/2]", "\x1b[0m" + "Version installing...");
      runCommand("npm run --silent install:version");
      runCommand("npm run --silent tools:version:update");

      console.log("\x1b[35m" + "[2/2]", "\x1b[0m" + "Breaking installing...");
      runCommand("npm run --silent install:breaking");
      console.log(
        "\x1b[32m" +
          "✔   Lyttle Tools has successfully been installed!" +
          "\x1b[0m"
      );
    } catch (e) {
      console.log("myERR", e);
      console.log(
        "\x1b[31m" +
          "❌   Something went horribly wrong, please contract the developer!" +
          "\x1b[0m"
      );
    }
  }

  installer();
});
