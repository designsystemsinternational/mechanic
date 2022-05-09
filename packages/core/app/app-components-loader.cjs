const path = require("path");
const { getOptions } = require("loader-utils");

module.exports = function () {
  const { appCompsPath } = getOptions(this);

  const result = appCompsPath
    ? `
import * as components from "${appCompsPath.split(path.sep).join("/")}";
export const appComponents = components;
`
    : "export const appComponents = {};";
  // console.log(result);
  return result;
};
