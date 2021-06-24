const { getOptions } = require("loader-utils");

module.exports = function (source) {
  const options = getOptions(this);

  console.log({ options });

  return `
  console.log("HEEEEEY");
  module.exports = "Hey yall!";
  `;
};
