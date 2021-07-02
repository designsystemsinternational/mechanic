#!/usr/bin/env node
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { create } = require(".");

const argv = yargs(hideBin(process.argv)).argv;
create(argv);
