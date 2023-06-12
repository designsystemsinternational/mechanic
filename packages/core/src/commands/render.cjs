const path = require("path");
const fs = require("fs");
const headless = require("@mechanic-design/headless");

const { formatTimestamp, getConfig, writeToFile } = require("./utils.cjs");

const {
  spinners: { mechanicSpinner: spinner },
  colors: { success }
} = require("@mechanic-design/utils");

/**
 * Removes all expected parameters from the argv object.
 * Returns remaining parameters, so they can be passed as
 * inputs to the design function.
 * @param {object} argv
 * @return object
 */
const getParameters = argv => {
  const IGNORE_LIST = [
    "_",
    "configPath",
    "config-path",
    "distDir",
    "dist-dir",
    "$0",
    "functionName",
    "function-name",
    "outputFile",
    "output-file",
    "directory"
  ];

  let obj = {};

  for (const key of Object.keys(argv)) {
    if (!IGNORE_LIST.includes(key)) obj[key] = argv[key];
  }

  return obj;
};

const command = async argv => {
  const { functionName } = argv;
  spinner.start("Setting up");

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
    spinner.succeed();
  } else {
    spinner.fail(
      "No build directory found. Make sure to run mechanic build first."
    );
    return;
  }

  spinner.start("Rendering");

  await headless.render({
    distDir,
    functionName,
    parameters: getParameters(argv),
    callback: ({ data, duration }) => {
      try {
        const outPath = path.join(process.cwd(), argv.outputFile);
        writeToFile(outPath, data);
        spinner.succeed(`Rendered`);
        console.log();
        console.log(`Output\t${success(outPath)}`); 
        console.log(`Took\t${success(formatTimestamp(duration))}`);
      } catch (e) {
        spinner.fail(`Error rendering.`);
        console.log(e);
      }
    }
  });
};

module.exports = command;
