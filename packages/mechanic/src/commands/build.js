const webpack = require("webpack");
const path = require("path");
const fs = require("fs-extra");

const ora = require("ora");
const {
  spinners: { mechanicSpinner, success }
} = require("@designsystemsinternational/mechanic-utils");

const getConfig = async configPath => {
  const exists = await fs.pathExists(configPath);
  if (!exists) {
    return;
  }
  return require(path.join(process.cwd(), configPath));
};

const getFunctionsPath = async () => {
  const exists = await fs.pathExists(path.join(process.cwd(), "functions", "index.js"));
  return exists ? path.join(process.cwd(), "functions", "index.js") : undefined;
};

const command = async argv => {
  // Start UI spinner
  const spinner = ora({
    text: "Building...",
    spinner: mechanicSpinner
  }).start();

  const webpackConfigGenerator = require("../../app/webpackConfigGenerator");
  const config = webpackConfigGenerator("prod");

  const compiler = webpack(config);

  compiler.run((err, stats) => {
    // [Stats Object](#stats-object) https://webpack.js.org/api/node/#stats-object
    if (err || stats.hasErrors()) {
      // [Handle errors here](#error-handling)
      console.log("Error!");
      if (err) console.log(err);
      else
        console.log(
          stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true // Shows colors in the console
          })
        );
    } else {
      spinner.succeed(success(`Mechanic built`));
    }
  });
};

module.exports = command;
