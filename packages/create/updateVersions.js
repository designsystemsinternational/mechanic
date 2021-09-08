// Modified from https://github.com/vitejs/vite/blob/main/packages/create-vite/updateVersions.js
const fs = require("fs");
const path = require("path");

const currentVersion = require("../../lerna.json").version;

(async () => {
  const projectTemplatePkgPath = path.join(
    __dirname,
    "project-template",
    `package.json`
  );
  const projectTemplatePkg = require(projectTemplatePkgPath);
  projectTemplatePkg.devDependencies[
    "@mechanic-design/core"
  ] = `^${currentVersion}`;
  projectTemplatePkg.devDependencies[
    "@mechanic-design/cli"
  ] = `^${currentVersion}`;
  fs.writeFileSync(
    projectTemplatePkgPath,
    JSON.stringify(projectTemplatePkg, null, 2) + "\n"
  );

  for (const directory of ["function-templates", "function-examples"]) {
    const bases = fs
      .readdirSync(path.join(__dirname, directory))
      .filter((d) => d !== "index.js");
    for (const base of bases) {
      const dependenciesPath = path.join(
        __dirname,
        directory,
        base,
        `dependencies.json`
      );
      const dependencies = require(dependenciesPath);
      for (const depType in dependencies) {
        for (const dep in dependencies[depType]) {
          if (dep.startsWith("@mechanic-design/")) {
            dependencies[depType][dep] = `^${currentVersion}`;
          }
        }
      }
      fs.writeFileSync(
        dependenciesPath,
        JSON.stringify(dependencies, null, 2) + "\n"
      );
    }
  }
})();
