const path = require("path");
const express = require("express");
const portfinder = require("portfinder");
const history = require("connect-history-api-fallback");
const { getConfig, setCustomInterrupt, greet, goodbye } = require("./utils.cjs");

const {
  spinners: { mechanicSpinner: spinner },
  colors: { success }
} = require("@mechanic-design/utils");

const command = async argv => {
  // Greet and intro command
  greet();
  console.log(
    "This command will serve whatever already built Mechanic app (npm run build) for you to test and use your design functions.\n"
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
  const distDir = path.normalize(
    argv.distDir !== "./dist" ? argv.distDir : config.distDir || "./dist"
  );

  spinner.start("Starting off server...");
  // Set port and express server
  portfinder.basePort = config.port != null ? config.port : argv.port;
  const port = await portfinder.getPortPromise();
  const app = express();
  let status = "start-server";

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
  spinner.start(`Serving built app at ${distDir}...`);
  // // https://stackoverflow.com/questions/43921770/webpack-dev-middleware-pass-through-for-all-routes
  app.use(history());
  app.use(express.static(path.resolve(distDir)));

  // Done!
  status = "started";
  spinner.succeed(
    success(
      `Serving mechanic app (${distDir}) at http://localhost:${port} . Open that address on Chrome for best experience. `
    )
  );
  console.log(success("If you wish to stop this server, press CTRL+C. "));
  setCustomInterrupt(goodbye);
};

module.exports = command;
