const path = require("path");
module.exports = getCommandHandler => ({
  command: "render functionName outputFile [configPath] [distDir]",
  aliases: ["r"],
  desc: "Headlessly renders a design function",
  builder: yargs =>
    yargs
      .options({
        functionName: {
          description: "Name of the function to render"
        },
        outputFile: {
          description: "Path to the file to write to"
        },
        configPath: {
          type: "string",
          description: "Path to mechanic config file"
        },
        distDir: {
          type: "string",
          description: "Custom build directory"
        }
      })
      .default("configPath", path.normalize("./mechanic.config.js"))
      .default("distDir", path.normalize("./dist")),
  handler: getCommandHandler("render")
});

