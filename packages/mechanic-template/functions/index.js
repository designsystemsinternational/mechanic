import { setUp } from "mechanic-utils";

const functionsContext = require.context("../functions", true, /^(.{2,})\/index\.js$/);

setUp(functionsContext);
