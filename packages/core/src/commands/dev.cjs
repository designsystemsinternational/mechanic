const path = require("path");
const express = require("express");
const portfinder = require("portfinder");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const history = require("connect-history-api-fallback");
const webpackConfigGenerator = require("../../app/webpackConfigGenerator.cjs");
const {
  getConfig,
  getFunctionsPath,
  getInputsPath,
  setCustomInterrupt,
  generateInputScript,
  generateFuncTempScripts,
  greet,
  goodbye
} = require("./utils.cjs");

const { spinners, colors } = require("@mechanic-design/utils");
const { mechanicSpinner: spinner } = spinners;
const { success } = colors;

const command = async argv => {
  // Greet and intro command
  greet();
  console.log(
    "This command will look into your Mechanic project and design functions and serve an app where you can test and use your code.\n"
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

  // Seek custom inputs path
  spinner.start("Seeking custom inputs directory...");
  const inputsPath = await getInputsPath(argv.inputsPath, config);
  if (inputsPath) {
    spinner.succeed(`Custom inputs directory found: ${success(path.relative(".", inputsPath))}`);
  } else {
    spinner.succeed(`Custom inputs directory not found. No custom inputs being used!`);
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

  spinner.start("Starting off server...");
  // Set port and express server
  portfinder.basePort = argv.port !== null ? argv.port : config.port;
  const port = await portfinder.getPortPromise();
  const app = express();

  let status = "start-server";
  app.use((req, res, next) => {
    if (status === "started") {
      next();
    } else {
      if (req.originalUrl === "/font")
        res.format({
          "font/otf": () =>
            res.sendFile(
              require.resolve("@mechanic-design/fonts/PP-Object-Sans/PPObjectSans-Regular.otf")
            )
        });
      else
        res.format({
          default: () => res.sendFile(path.resolve(__dirname, "./html/loading.html")),
          "image/svg+xml": () => res.sendFile(path.resolve(__dirname, "../../app/favicon.svg")),
          "text/html": () => res.sendFile(path.resolve(__dirname, "./html/loading.html")),
          "application/json": () => res.json({ loading: true, status })
        });
    }
  });

  const { server } = await new Promise((resolve, reject) => {
    const server = app.listen(port, error => {
      if (error) {
        return reject(error);
      }
      return resolve({ server });
    });
  });
  spinner.succeed(`Server listening on port ${port}`);

  spinner.start("Generating temp files to serve...");
  const [customInputs, inputScriptContent] = generateInputScript(inputsPath);
  const inputs = { inputsPath, inputScriptContent, customInputs };
  const [designFunctions, funcsTempDirObj] = generateFuncTempScripts(functionsPath);
  spinner.succeed("Temp files created!");
  spinner.start("Loading webpack compilation...");

  // Load webpack middleware to load mechanic app
  const webpackConfig = webpackConfigGenerator("dev", designFunctions, inputs, null, "/");
  const compiler = webpack(webpackConfig);
  // https://stackoverflow.com/questions/43921770/webpack-dev-middleware-pass-through-for-all-routes
  app.use(history());
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    })
  );
  app.use(webpackHotMiddleware(compiler, { log: null }));

  // Allow the spinner time to flush its output to the console.
  await new Promise(resolve => setTimeout(resolve, 2000));
  // Done!
  status = "started";
  spinner.succeed(
    success(
      `Mechanic app ready at http://localhost:${port} . Open that address on Chrome for best experience. `
    )
  );
  console.log();
  console.log(
    "All other logs are from webpack (that bundles your code). " +
      success("If you wish to stop this server, press CTRL+C. ")
  );
  console.log();

  setCustomInterrupt(goodbye, [funcsTempDirObj]);
};

module.exports = command;
