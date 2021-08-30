const path = require("path");
const webpack = require("webpack");
const { getConfig, getFunctionsPath, generateTempScripts, greet, goodbye } = require("./utils.cjs");
const webpackConfigGenerator = require("../../app/webpackConfigGenerator.cjs");

const {
  spinners: { mechanicSpinner: spinner },
  colors: { success, fail }
} = require("@mechanic-design/utils");

const command = async argv => {
  // Greet and intro command
  greet();
  console.log(
    "This command will look into your Mechanic project and design functions and locally build an app for you to serve later.\n"
  );
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

  spinner.start("Generating temp files to serve...");
  const [designFunctions] = generateTempScripts(functionsPath);
  spinner.succeed("Temp files created!");

  const distDir = path.normalize(config.distDir ?? argv.distDir ?? "./dist");
  const publicPath = config.publicPath;

  spinner.start("Loading webpack compilation...");
  const webpackConfig = webpackConfigGenerator("prod", designFunctions, distDir, publicPath);
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
      spinner.succeed(success(`Mechanic app built at directory ${distDir}/!\n`));
      console.log(
        "You can serve locally and use the builded app using the `npm run serve` command!"
      );
      goodbye();
    }
  });
};

module.exports = command;
