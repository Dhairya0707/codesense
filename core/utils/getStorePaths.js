const path = require("path");

function getStorePaths() {
  const repoPath = process.cwd();
  const baseDir = path.join(repoPath, ".codesense");

  return {
    repoPath,
    baseDir,
    vectorDir: path.join(baseDir, "vectordb"),
    stateFile: path.join(baseDir, "status.json"),
  };
}

module.exports = getStorePaths;
