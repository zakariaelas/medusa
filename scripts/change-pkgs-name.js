const path = require(`path`)
const fs = require("fs")
const rootPackageJson = require("../package.json")

const newPkgName = "dusame"

const pkgs = fs.readdirSync(path.join(__dirname, "../", "packages"))

const transformPkgName = (pkgName) => {
  if (pkgName.startsWith("@medusajs")) {
    pkgName = pkgName.replaceAll(/@medusajs/gi, "@zakariaelas")
  }
  return pkgName.replaceAll(/medusa/gi, newPkgName)
}

const transformDepsNames = (deps) => {
  const output = {}
  for (const [name, version] of Object.entries(deps)) {
    if (name.includes("medusa")) {
      const transformedName = transformPkgName(name)
      output[transformedName] = version
      output[name] = `npm:${transformedName}@${version}`
    } else {
      output[name] = version
    }
  }
  return output
}

for (const pkg of pkgs) {
  const packageJsonLocation = path.join(
    __dirname,
    "..",
    "packages",
    pkg,
    "package.json"
  )
  const pkgPackageJson = JSON.parse(fs.readFileSync(packageJsonLocation))
  pkgPackageJson.name = transformPkgName(pkgPackageJson.name)
  pkgPackageJson.author = "Zakaria S. El Asri"
  pkgPackageJson.repository.url = "https://github.com/zakariaelas/medusa.git"
  if (pkgPackageJson.dependencies) {
    pkgPackageJson.dependencies = transformDepsNames(
      pkgPackageJson.dependencies
    )
  }
  if (pkgPackageJson.devDependencies) {
    pkgPackageJson.devDependencies = transformDepsNames(
      pkgPackageJson.devDependencies
    )
  }
  fs.writeFileSync(packageJsonLocation, JSON.stringify(pkgPackageJson))
}
