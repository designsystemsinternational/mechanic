const { create } = require("@designsystemsinternational/create-mechanic");

module.exports = {
  command: "new",
  aliases: ["n"],
  desc: "Creates new mechanic project skeleton",
  builder: () => {},
  handler: create,
};
