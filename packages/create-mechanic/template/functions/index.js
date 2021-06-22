const { setUp } = require("@designsystemsinternational/mechanic");

const functionsContext = require.context(
  "../functions",
  true,
  /^(.{2,})\/index\.js$/
);

setUp(functionsContext);
