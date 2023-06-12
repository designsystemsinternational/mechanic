const path = require("path");
const fs = require("fs");
const headless = require("@mechanic-design/headless");

const { getConfig, writeToFile } = require("./utils.cjs");

const buildCommand = require("./build.cjs");

const {
  spinners: { mechanicSpinner: spinner },
  colors: { success, fail }
} = require("@mechanic-design/utils");

const command = async argv => {
  const { functionName } = argv;
  spinner.start("Checking if mechanic is already built.");

  const { config, configPath } = await getConfig(argv.configPath);

  if (!config) {
    spinner.fail(`Mechanic config file (${configPath}) not found`);
    return;
  }

  const distDir = path.normalize(
    config.distDir != null
      ? config.distDir
      : argv.distDir != null
        ? argv.distDir
        : "./dist"
  );

  if (fs.existsSync(distDir)) {
    spinner.succeed("Already built, rendering now...");
  } else {
    spinner.fail("No build directory found. Building now, hold on...");
    await new Promise(res => {
      buildCommand(argv, res);
    });
  }

  spinner.start(`Locating design function ${functionName}`);

  if (!fs.existsSync(path.join(distDir, `${functionName}.html`))) {
    spinner.fail(`No design function was found for ${functionName}`);
    return;
  }

  spinner.succeed();

  console.log();

  spinner.start('Rendering');

  await headless.render({
    distDir,
    functionName,
    callback: ({ data, mimeType, duration }) => {
      const outPath = path.join(process.cwd(), argv.outputFile);
      writeToFile(data, mimeType, outPath);
      spinner.succeed(`Rendered to ${outPath} in ${duration}ms`)
    }
  });
};

module.exports = command;
