const fs = require("fs");
const path = require("path");

// const ignore_files = new Set([
//   "node_modules",
//   ".git",
//   ".gitignore",
//   "dist",
//   "build",
//   ".next",
//   "package-lock.json",
//   "coverage",
//   ".env",
//   "test",
//   ".codesense",
//   "vectordb",
//   "codesense",
// ]);
const ignore_files = new Set([
  // Dependency & Build Folders
  "node_modules",
  ".git",
  ".gitignore",
  "dist",
  "build",
  ".next",
  "out",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "coverage",
  ".env",
  ".codesense",
  "vectordb",
  "codesense",

  // IDEs & OS Metadata
  ".vscode",
  ".idea",
  ".expo",
  ".DS_Store",
  "Thumbs.db",

  // Large Assets/Binaries (LLMs can't read these properly)
  "public",
  "assets",
  "static",
  "vendor",
  "bin",
  "obj", // For C# / C++ projects

  // Media (Indexing these is a waste of API tokens)
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "pdf",
  "mp4",
  "ico",
  "woff",
  "woff2",

  // Log Files
  "logs",
  "*.log",
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
]);

function scanRepo(roothpath) {
  let results = [];

  function scan(currentpath) {
    let enties;

    try {
      enties = fs.readdirSync(currentpath, { withFileTypes: true });
    } catch (error) {
      return;
    }

    for (const entry of enties) {
      const fullpath = path.join(currentpath, entry.name);
      if (ignore_files.has(entry.name)) continue;
      if (entry.isDirectory()) {
        if (ignore_files.has(entry.name)) {
          continue;
        }

        scan(fullpath);
      }
      if (entry.isFile()) {
        results.push(path.resolve(fullpath));
      }
    }
  }
  scan(roothpath);
  return results;
}

module.exports = scanRepo;
