// Modified from https://github.com/vitejs/vite/blob/main/packages/create-vite/updateVersions.js
const fs = require("fs");
const path = require("path");

(async () => {
  const projectTemplatePkgPath = path.join(
    __dirname,
    "project-template",
    `package.json`
  );
  const projectTemplatePkg = require(projectTemplatePkgPath);
  projectTemplatePkg.devDependencies["@mechanic-design/core"] = `^${
    require("../core/package.json").version
  }`;
  projectTemplatePkg.devDependencies["@mechanic-design/cli"] = `^${
    require("../cli/package.json").version
  }`;
  fs.writeFileSync(
    projectTemplatePkgPath,
    JSON.stringify(projectTemplatePkg, null, 2) + "\n"
  );
  console.log(`Updated: ${path.relative(__dirname, projectTemplatePkgPath)}`);

  for (const directory of ["function-templates", "function-examples"]) {
    const bases = fs
      .readdirSync(path.join(__dirname, directory))
      .filter(d => d !== "index.js");

    for (const base of bases) {
      console.log(`\nTraversing: ${base}`);
      const dependenciesPath = path.join(
        __dirname,
        directory,
        base,
        `dependencies.json`
      );
      // skip if file doesn't exist
      if (!fs.existsSync(dependenciesPath)) {
        console.log(`Skipping: ${path.relative(__dirname, dependenciesPath)}`);
        continue;
      }

      const dependencies = require(dependenciesPath);

      for (const depType in dependencies) {
        for (const dep in dependencies[depType]) {
          if (dep.startsWith("@mechanic-design/")) {
            const mechanicDep = dep.replace("@mechanic-design", "");
            const currentVersion =
              require(`../${mechanicDep}/package.json`).version;
            dependencies[depType][dep] = `^${currentVersion}`;
          }
        }
      }

      fs.writeFileSync(
        dependenciesPath,
        JSON.stringify(dependencies, null, 2) + "\n"
      );
      console.log(`Updated: ${path.relative(__dirname, dependenciesPath)}`);
    }
  }
})();
