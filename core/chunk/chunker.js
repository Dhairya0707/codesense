const fs = require("fs");
const path = require("path");

function chuckfile(files) {
  const chunks = [];

  for (const file of files) {
    let content;

    try {
      content = fs.readFileSync(file.path, "utf-8");
    } catch (error) {
      console.log(error);
      continue;
    }

    chunks.push({
      id: `${file.role}-${path.basename(file.path)}`,
      role: file.role,
      file: path.basename(file.path),
      content,
    });
  }
  return chunks;
}

module.exports = chuckfile;
