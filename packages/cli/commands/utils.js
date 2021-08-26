const path = require("path");

const mechanic = "@mechanic-design/core";

const getIsMechanicProject = () => {
  let isMechanicProject = false;

  try {
    const { dependencies, devDependencies } = require(path.resolve(
      "./package.json"
    ));
    const config = require(path.resolve("mechanic.config.js"));
    isMechanicProject =
      ((dependencies && dependencies[mechanic]) ||
        (devDependencies && devDependencies[mechanic])) &&
      config;
  } catch (err) {
    /* ignore */
  }
  return !!isMechanicProject;
};

module.exports = {
  mechanic,
  getIsMechanicProject,
};
