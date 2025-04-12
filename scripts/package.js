// NOTE: This script generates the package.json file for the dist folder.

const fs = require("fs");

const { version, dependencies, peerDependencies } = JSON.parse(
  fs.readFileSync("./package.json", "utf8")
);

fs.writeFileSync(
  "./dist/package.json",
  JSON.stringify({
    name: "@unicubate/shared",
    version,
    description: "Shared between backend and frontend repos",
    license: "ISC",
    repository: {
      type: "git",
      url: "https://github.com/unicubate/shared.git",
    },
    dependencies,
    peerDependencies,
  })
);
