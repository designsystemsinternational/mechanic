const path = require("path");
const { getOptions } = require("loader-utils");

module.exports = function () {
  const { designFunctions } = getOptions(this);

  let importSection = "";
  let codeSection = "";
  let count = 0;
  Object.entries(designFunctions).map(([name, designFunctionObj]) => {
    importSection += `import * as export${count} from "${designFunctionObj.original
      .split(path.sep)
      .join("/")}";\n`;
    if (codeSection !== "") {
      codeSection += ",\n";
    }
    codeSection += `"${name}": export${count}`;
    count += 1;
  });

  const result = `
${importSection}

const allFunctions = {
  ${codeSection}
};

const functions = Object.fromEntries(
  Object.entries(allFunctions).filter(([name, func]) => !func.settings.hideFunction)
);

export default functions;
`;
  // console.log(result);
  return result;
};
