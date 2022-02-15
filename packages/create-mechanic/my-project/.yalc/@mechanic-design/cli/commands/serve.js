const path = require("path");
module.exports = (getCommandHandler) => ({
  command: "serve [port] [configPath] [distDir]",
  aliases: ["s"],
  desc: "Starts local server for built mechanic project",
  builder: (yargs) =>
    yargs
      .options({
        port: {
          description: "Custom port to serve app",
        },
        configPath: {
          type: "string",
          description: "Path to mechanic config file",
        },
        distDir: {
          type: "string",
          description: "Custom build directory",
        },
      })
      .default("port", 3000)
      .default("configPath", path.normalize("./mechanic.config.js"))
      .default("distDir", path.normalize("./dist")),
  handler: getCommandHandler("serve"),
});
