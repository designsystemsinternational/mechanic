module.exports = (getCommandHandler) => ({
  command: "dev [port] [configPath]",
  aliases: ["d"],
  desc: "Starts local server for mechanic project",
  builder: (yargs) =>
    yargs.default("port", 3000).default("configPath", "mechanic.config.js"),
  handler: getCommandHandler("dev"),
});
