const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");
const { getConfig } = require("./utils");

const ora = require("ora");
const {
  spinners: { mechanicSpinner, success }
} = require("@designsystemsinternational/mechanic-utils");

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

  // // https://stackoverflow.com/questions/43921770/webpack-dev-middleware-pass-through-for-all-routes
  app.use(history());
  app.use(express.static(path.resolve(process.cwd(), "./dist")));

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Done!
  status = "started";
  spinner.succeed(success(`Mechanic app ready at http://localhost:${port}`));
};

module.exports = command;
