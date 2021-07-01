module.exports = (getCommandHandler) => ({
  command: "serve [port] [configPath] [distDir]",
  aliases: ["s"],
  desc: "Starts local server for built mechanic project",
  builder: (yargs) =>
    yargs
      .default("port", 3000)
      .default("configPath", "./mechanic.config.js")
      .default("distDir", "./dist"),
  handler: getCommandHandler("serve"),
});
