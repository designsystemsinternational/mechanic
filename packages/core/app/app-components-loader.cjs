const path = require("path");

module.exports = function () {
  const { appCompsPath } = this.getOptions();

  const result = appCompsPath
    ? `
import * as components from "${appCompsPath.split(path.sep).join("/")}";
export const appComponents = components;
`
    : "export const appComponents = {};";
  // console.log(result);
  return result;
};
