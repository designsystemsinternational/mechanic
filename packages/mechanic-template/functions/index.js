import { requireFunctions, setUp } from "mechanic-utils";

const functionsContext = require.context("../functions", true, /^(.{2,})\/index\.js$/);
const { functions, engines } = requireFunctions(functionsContext);

setUp(functions, engines);
