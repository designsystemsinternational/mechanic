// Modified from https://github.com/keystonejs/create-keystone-app/blob/main/create-keystone-app/src/checkVersion.ts
const getPackageJson = require("package-json");
const currentPkgJson = require("./package.json");
const semver = require("semver");
const {
  spinners: { mechanicSpinner: spinner },
} = require("@mechanic-design/utils");

const getLatestCommand = "npm init mechanic@latest";

const checkVersion = async () => {
  try {
    spinner.start("Checking running version...");
    const { version } = await getPackageJson(currentPkgJson.name);
    if (typeof version !== "string") {
      throw new Error(
        "version from package metadata was expected to be a string but was not"
      );
    }
    if (semver.lt(currentPkgJson.version, version)) {
      spinner.warn(
        `You're running an old version of ${currentPkgJson.name}, please update to ${version} or run using \`${getLatestCommand}\`.`
      );
    } else {
      spinner.stop();
    }
  } catch (err) {
    spinner.fail(
      `A problem occurred fetching the latest version of ${currentPkgJson.name}`
    );
    console.error(err);
  }
};

module.exports = {
  checkVersion,
};
