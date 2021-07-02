const { create } = require("@designsystemsinternational/create-mechanic");
const { argv } = require("yargs");

module.exports = {
  command: "new",
  aliases: ["n"],
  desc: "Creates new mechanic project ",
  builder: (yargs) =>
    yargs
      .option("template", { aliases: ["t"] })
      .option("example", { aliases: ["e"] }),
  // .command({
  //   command: "function",
  //   aliases: ["f"],
  //   desc: "Creates new mechanic design function in existing mechanic project",
  //   builder: (yargs) => yargs,
  //   handler: getCommandHandler("new_function"),
  // })
  handler: (argv) => {
    argv._ = argv._.slice(1);
    create(argv);
  },
};
