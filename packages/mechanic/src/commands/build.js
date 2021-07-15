const path = require("path");
const webpack = require("webpack");
const { getConfig, getFunctionsPath } = require("./utils");
const webpackConfigGenerator = require("../../app/webpackConfigGenerator");

const {
  spinners: { mechanicSpinner: spinner },
  colors: { success, fail }
} = require("@designsystemsinternational/mechanic-utils");

const command = async argv => {
  // Load config file
  spinner.start("Loading mechanic config file...");
  const { config, configPath } = await getConfig(argv.configPath);
  // Stop if no config file is found.
  if (!config) {
    spinner.fail(`Mechanic config file (${configPath}) not found`);
    return;
  } else {
    spinner.succeed(`Mechanic config file loaded: ${success(path.relative(".", configPath))}`);
  }

  // Seek functions path
  spinner.start("Seeking design function directory...");
  const functionsPath = await getFunctionsPath(argv.functionsPath, config);
  if (!functionsPath) {
    spinner.fail(`Design functions directory file not found`);
    return;
  } else {
    spinner.succeed(
      `Design functions directory found: ${success(path.relative(".", functionsPath))}`
    );
  }

  const distDir = path.normalize(argv.distDir !== "./dist" ? argv.distDir : config.distDir);

  spinner.start("Loading webpack compilation...");
  const webpackConfig = webpackConfigGenerator("prod", functionsPath, distDir);
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    // [Stats Object](#stats-object) https://webpack.js.org/api/node/#stats-object
    if (err || stats.hasErrors()) {
      // [Handle errors here](#error-handling)
      spinner.fail(fail(`Error building:`));
      if (err) console.log(err);
      else
        console.log(
          stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true // Shows colors in the console
          })
        );
    } else {
      spinner.succeed(success(`Mechanic app built at ${argv.distDir}!`));
    }
  });
};

module.exports = command;
