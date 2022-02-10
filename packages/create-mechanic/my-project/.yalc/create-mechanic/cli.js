#!/usr/bin/env node
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { checkVersion } = require("./checkVersion");
const { create, options } = require(".");

const argv = yargs(hideBin(process.argv))
  .scriptName("create-mechanic")
  .usage("$0 project-name [template] [example]")
  .options(options).argv;

(async () => {
  await checkVersion();
  create(argv);
})();
