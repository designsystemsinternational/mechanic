const command = async () => {
  console.log(`Start Done!`);
};

module.exports = {
  command: "start",
  aliases: ["s"],
  desc: "Starts mechanic project",
  builder: () => {},
  handler: command,
};
