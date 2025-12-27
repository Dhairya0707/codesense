const fs = require("fs");
const path = require("path");
const getStorePaths = require("../utils/getStorePaths.js");

const STORE_DIR = path.join(process.cwd(), "vectordb");
const STATE_FILE = path.join(STORE_DIR, "status.json");

// function isIndexed() {
//   return fs.existsSync(STATE_FILE);
// }
function isIndexed() {
  const { stateFile } = getStorePaths();
  return fs.existsSync(stateFile);
}

function writeIndexState() {
  const { baseDir, stateFile, repoPath } = getStorePaths();

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const state = {
    indexed: true,
    repoPath, // this is process.cwd()
    indexedAt: new Date().toISOString(),
  };

  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}
// function writeIndexState(repoPath) {
//   if (!fs.existsSync(STORE_DIR)) {
//     fs.mkdirSync(STORE_DIR, { recursive: true });
//   }

//   const state = {
//     indexed: true,
//     repoPath,
//     indexedAt: new Date().toISOString(),
//   };

//   fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
// }

// function clearIndexState() {
//   if (fs.existsSync(STATE_FILE)) {
//     fs.unlinkSync(STATE_FILE);
//   }
// }
function clearIndexState() {
  const { stateFile } = getStorePaths();
  if (fs.existsSync(stateFile)) fs.unlinkSync(stateFile);
}

module.exports = {
  isIndexed,
  writeIndexState,
  clearIndexState,
};
