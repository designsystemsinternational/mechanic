const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
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

const getFunctionsPath = async (functionsPath, config) => {
  const relativePath = functionsPath || config.functionsPath || "./functions";
  const fullPath = path.resolve(relativePath);
  console.log(relativePath);
  console.log(fullPath);
  const exists = await fs.pathExists(fullPath);
  return exists ? fullPath : null;
};

const command = async argv => {
  // Start UI spinner
  const spinner = ora({
    text: "Starting off server",
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

  // Set port and express server
  const port = config.port ? config.port : argv.port;

  let status = "start-server";
  const app = express();

  app.use((req, res, next) => {
    if (status === "started") {
      next();
    } else {
      res.format({
        default: () => res.sendFile(path.resolve(__dirname, "./html/loading.html")),
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

  // Load webpack middleware to load mechanic app
  const webpackConfigGenerator = require("../../app/webpackConfigGenerator");
  const webpackConfig = webpackConfigGenerator("dev", functionsPath);
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    })
  );

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Done!
  status = "started";
  spinner.succeed(success(`Mechanic app ready at http://localhost:${port}`));
};

module.exports = command;
