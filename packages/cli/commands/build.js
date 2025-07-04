const path = require("path");
module.exports = getCommandHandler => ({
  command: "build [configPath] [functionsPath] [distDir]",
  aliases: ["b"],
  desc: "Builds local project",
  builder: yargs =>
    yargs
      .options({
        configPath: {
          type: "string",
          description: "Path to mechanic config file"
        },
        functionsPath: {
          type: "string",
          description: `Path to directory containing design functions. Fallback is ${path.normalize(
            "./functions"
          )}.`
        },
        inputsPath: {
          type: "string",
          description: `Path to directory containing custom input components. Fallback is ${path.normalize(
            "./inputs"
          )}.`
        },
        appCompsPath: {
          type: "string",
          description: `Path to directory containing custom app components. Fallback is ${path.normalize(
            "./app"
          )}.`
        },
        staticPath: {
          type: "string",
          description: `Path to static directory of files to serve. Fallback is ${path.normalize(
            "./static"
          )}.`
        },
        distDir: {
          type: "string",
          description: "Custom build directory"
        }
      })
      .default("configPath", path.normalize("./mechanic.config.js"))
      .default("distDir", path.normalize("./dist")),
  handler: getCommandHandler("build")
});
