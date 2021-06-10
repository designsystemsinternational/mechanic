const command = async () => {
  console.log(`Dev Done!`);
};

module.exports = {
  command: "dev",
  aliases: ["d"],
  desc: "Starts dev server for mechanic project",
  builder: () => {},
  handler: command,
};
