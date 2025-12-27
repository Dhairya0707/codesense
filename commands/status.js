const fs = require("fs");
const path = require("path");
const getStorePaths = require("../core/utils/getStorePaths");

/**
 * CLI: status command
 */
function statusCommand() {
  const { stateFile, indexDir } = getStorePaths();

  if (!fs.existsSync(stateFile)) {
    console.log("\n\x1b[31m❌ Project not indexed.\x1b[0m");
    console.log(
      "👉 Run \x1b[33mcodesense index\x1b[0m to analyze this codebase.\n"
    );
    return;
  }

  try {
    const state = JSON.parse(fs.readFileSync(stateFile, "utf-8"));

    // Calculate local storage size for the "Frugal" feel
    let storageSize = "0 KB";
    if (fs.existsSync(indexDir)) {
      const stats = fs.statSync(indexDir);
      // Simplified size calculation (index folder)
      storageSize = (stats.size / 1024).toFixed(2) + " KB";
    }

    console.log("\n\x1b[1m\x1b[32m📊 CodeSense Status Report\x1b[0m");
    console.log("─".repeat(40));

    console.log(
      `\x1b[1mStatus:\x1b[0m      ${
        state.indexed ? "✅ Fully Indexed" : "⚠️  Incomplete"
      }`
    );
    console.log(
      `\x1b[1mProject:\x1b[0m     ${path.basename(state.repoPath)} \x1b[2m(${
        state.repoPath
      })\x1b[0m`
    );
    console.log(
      `\x1b[1mLast Sync:\x1b[0m   ${new Date(state.indexedAt).toLocaleString()}`
    );

    // console.log("─".repeat(40));

    // console.log(`\x1b[1mIntelligence stats:\x1b[0m`);
    // console.log(`- Local Storage:  ${storageSize}`);
    // console.log(`- API Engine:     Gemini 1.5 Flash`);

    console.log("─".repeat(40));
    console.log(
      "\x1b[2mYour local intelligence is ready for queries.\x1b[0m\n"
    );
  } catch (error) {
    console.log("\x1b[31m❌ Error reading index state:\x1b[0m", error.message);
  }
}

module.exports = statusCommand;

// const fs = require("fs");
// const getStorePaths = require("../core/utils/getStorePaths");

// /**
//  * CLI: status command
//  */
// function statusCommand() {
//   const { stateFile } = getStorePaths();

//   if (!fs.existsSync(stateFile)) {
//     console.log("❌ Repository not indexed.");
//     console.log("Run `codesense index` first.");
//     return;
//   }

//   const state = JSON.parse(fs.readFileSync(stateFile, "utf-8"));

//   console.log("\n\n📊 CodeSense Status\n");
//   console.log(`✔ Indexed: ${state.indexed}`);
//   console.log(`📂 Repo Path: ${state.repoPath}`);
//   console.log(
//     `🕒 Indexed At: ${new Date(state.indexedAt).toLocaleString()}\n\n`
//   );
// }

// module.exports = statusCommand;

// const fs = require("fs");
// const path = require("path");

// const STATE_FILE = path.join(process.cwd(), "vectordb", "status.json");

// /**
//  * CLI: status command
//  */
// function statusCommand() {
//   if (!fs.existsSync(STATE_FILE)) {
//     console.log("❌ Repository not indexed.");
//     console.log("Run `codesense index <path>` first.");
//     return;
//   }

//   const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));

//   console.log("📊 CodeSense Status\n");
//   console.log(`✔ Indexed: ${state.indexed}`);
//   console.log(`📂 Repo Path: ${state.repoPath}`);
//   console.log(`🕒 Indexed At: ${new Date(state.indexedAt).toLocaleString()}`);
// }

// module.exports = statusCommand;
