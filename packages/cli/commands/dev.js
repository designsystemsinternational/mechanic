const path = require("path");
module.exports = getCommandHandler => ({
  command: "dev [port] [configPath] [functionsPath]",
  aliases: ["d"],
  desc: "Starts local dev server for mechanic project",
  builder: yargs =>
    yargs
      .options({
        port: {
          description: "Custom port to serve app"
        },
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
        }
      })
      .default("port", 3000)
      .default("configPath", path.normalize("./mechanic.config.js")),
  handler: getCommandHandler("dev")
});
