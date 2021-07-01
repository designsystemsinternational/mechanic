const webpack = require("webpack");
const { getConfig, getFunctionsPath } = require("./utils");
const webpackConfigGenerator = require("../../app/webpackConfigGenerator");

const ora = require("ora");
const {
  spinners: { mechanicSpinner, success }
} = require("@designsystemsinternational/mechanic-utils");

const command = async argv => {
  // Start UI spinner
  const spinner = ora({
    text: "Building...",
    spinner: mechanicSpinner
  }).start();

  // Load config file
  const config = await getConfig(argv.configPath);
  // Stop if no config file is found.
  if (!config) {
    spinner.fail(`Mechanic config file (${configPath}) not found`);
    return;
  }

  const functionsPath = await getFunctionsPath(argv.functionsPath, config);
  if (!functionsPath) {
    spinner.fail(`Functions directory file not found`);
    return;
  }

  const webpackConfig = webpackConfigGenerator("prod", functionsPath);
  const compiler = webpack(webpackConfig);

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
