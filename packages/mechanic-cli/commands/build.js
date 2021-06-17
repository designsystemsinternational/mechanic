module.exports = (getCommandHandler) => ({
  command: "build",
  aliases: ["b"],
  desc: "Builds local project",
  builder: () => {},
  handler: getCommandHandler("build"),
});
