const path = require("path");
module.exports = (getCommandHandler) => ({
  command: "dev [port] [configPath] [functionsPath]",
  aliases: ["d"],
  desc: "Starts local dev server for mechanic project",
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
        functionsPath: {
          type: "string",
          description: "Path to directory containing design functions",
        },
        inputsPath: {
          type: "string",
          description: "Path to directory containing custom input components",
        },
        appCompsPath: {
          type: "string",
          description: "Path to directory containing custom app components",
        },
        staticPath: {
          type: "string",
          description: "Path to static directory of files to serve",
        },
      })
      .default("port", 3000)
      .default("configPath", path.normalize("./mechanic.config.js"))
      .default("functionsPath", path.normalize("./functions"))
      .default("inputsPath", path.normalize("./inputs"))
      .default("appCompsPath", path.normalize("./app"))
      .default("staticPath", path.normalize("./static")),
  handler: getCommandHandler("dev"),
});
