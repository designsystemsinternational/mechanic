module.exports = (getCommandHandler) => ({
  command: "build [configPath] [functionsPath]",
  aliases: ["b"],
  desc: "Builds local project",
  builder: (yargs) =>
    yargs
      .default("configPath", "./mechanic.config.js")
      .default("functionsPath", "./functions"),
  handler: getCommandHandler("build"),
});
