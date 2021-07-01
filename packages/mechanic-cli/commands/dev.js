module.exports = (getCommandHandler) => ({
  command: "dev [port] [configPath] [functionsPath]",
  aliases: ["d"],
  desc: "Starts local dev server for mechanic project",
  builder: (yargs) =>
    yargs
      .default("port", 3000)
      .default("configPath", "./mechanic.config.js")
      .default("functionsPath", "./functions"),
  handler: getCommandHandler("dev"),
});
