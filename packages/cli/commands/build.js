const path = require("path");
module.exports = (getCommandHandler) => ({
  command: "build [configPath] [functionsPath] [distDir]",
  aliases: ["b"],
  desc: "Builds local project",
  builder: (yargs) =>
    yargs
      .options({
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
        distDir: {
          type: "string",
          description: "Custom build directory",
        },
      })
      .default("configPath", path.normalize("./mechanic.config.js"))
      .default("functionsPath", path.normalize("./functions"))
      .default("distDir", path.normalize("./dist"))
      .default("inputsPath", path.normalize("./inputs"))
      .default("appCompsPath", path.normalize("./app"))
      .default("staticPath", path.normalize("./static")),
  handler: getCommandHandler("build"),
});
