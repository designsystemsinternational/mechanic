const express = require("express");
const path = require("path");
const fs = require("fs-extra");

const mechanicApp = require("@designsystemsinternational/mechanic-app");

const ora = require("ora");
const { mechanicSpinner, success } = require("./utils/spinners");

const getConfig = async (configPath) => {
  const exists = await fs.pathExists(configPath);
  if (!exists) {
    return;
  }
  return require(path.join(process.cwd(), configPath));
};

const getFunctionsPath = async () => {
  const exists = await fs.pathExists(
    path.join(process.cwd(), "functions", "index.js")
  );
  return exists ? path.join(process.cwd(), "functions", "index.js") : undefined;
};

const command = async (argv) => {
  // Start UI spinner
  const spinner = ora({
    text: "Starting off server",
    spinner: mechanicSpinner,
  }).start();

  // Load config file
  const config = await getConfig(argv.configPath);
  // Stop if no config file is found.
  if (!config) {
    spinner.fail(`Mechanic config file (${configPath}) not found`);
    return;
  }

  const functionsPath = await getFunctionsPath();
  if (!functionsPath) {
    spinner.fail(`Functions directory index.js file not found`);
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
        default: () =>
          res.sendFile(path.resolve(__dirname, "./html/loading.html")),
        "text/html": () =>
          res.sendFile(path.resolve(__dirname, "./html/loading.html")),
        "application/json": () => res.json({ loading: true, status }),
      });
    }
  });
  const { server } = await new Promise((resolve, reject) => {
    const server = app.listen(port, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve({ server });
    });
  });
  spinner.succeed(`Server listening on port ${port}`);

  // Load webpack middleware to load mechanic app
  const middleware = await mechanicApp.createMiddleware(functionsPath);
  // app.use((req, res, next) => res.json(mechanicApp));
  app.use([middleware]);
  // Time simulation for now
  // await new Promise((resolve) => setTimeout(resolve, 60000));

  // Done!
  status = "started";
  spinner.succeed(success(`Mechanic app ready at http://localhost:${port}`));
};

module.exports = {
  command: "serve [port] [configPath]",
  aliases: ["s"],
  desc: "Starts server for mechanic project",
  builder: (yargs) =>
    yargs.default("port", 3000).default("configPath", "mechanic.config.js"),
  handler: command,
};
