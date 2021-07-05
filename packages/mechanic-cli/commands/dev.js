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
      })
      .default("port", 3000)
      .default("configPath", "./mechanic.config.js")
      .default("functionsPath", "./functions"),
  handler: getCommandHandler("dev"),
});
