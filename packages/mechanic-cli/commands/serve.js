const express = require("express");
const path = require("path");

const ora = require("ora");
const { mechanicSpinner, success } = require("./utils/spinners");

const command = async (argv) => {
  const spinner = ora({
    text: "Starting off server",
    spinner: mechanicSpinner,
  }).start();

  // const port = args['--port'] ? args['--port'] : DEFAULT_PORT;
  const port = 3000;

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
  spinner.succeed(`Keystone server listening on port ${port}`);

  // app.use(middlewares);
  await new Promise((resolve) =>
    setTimeout(resolve, 10000 * (Math.random() + 1))
  );
  status = "started";
  spinner.succeed(
    success(`Keystone instance is ready at http://localhost:${port} 🚀`)
  );

  console.log(`Serve Done!`);
};

module.exports = {
  command: "Serve",
  aliases: ["s"],
  desc: "Starts server for mechanic project",
  builder: () => {},
  handler: command,
};
