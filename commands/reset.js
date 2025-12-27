const { hardResetDatabase } = require("../core/rag/vector");
const { clearIndexState, isIndexed } = require("../core/ingest/indexState");
const readline = require("readline");

/**
 * CLI: reset command
 */
async function resetCommand() {
  if (!isIndexed()) {
    console.log("\n\x1b[2mℹ️  No existing index found in this project.\x1b[0m");
    return;
  }

  console.log("\n\x1b[31m\x1b[1m⚠️  WARNING: Irreversible Action\x1b[0m");
  console.log(
    "This will permanently delete the local vector database and index state."
  );

  const confirmed = await askConfirmation(
    "👉 Are you absolutely sure you want to proceed? (y/N): "
  );

  if (!confirmed) {
    console.log("\x1b[32m✅ Reset aborted. Your index is safe.\x1b[0m\n");
    return;
  }

  console.log("\n🧹 \x1b[36mClearing local project intelligence...\x1b[0m");

  try {
    await hardResetDatabase();
    clearIndexState();
    console.log("✅ \x1b[32mProject index cleared successfully.\x1b[0m");
    console.log(
      "\x1b[2mNote: You will need to run `codesense index` before your next query.\x1b[0m\n"
    );
  } catch (error) {
    console.error(`❌ Error during reset: ${error.message}`);
  }
}

/**
 * Helper: Reusing the standard confirmation logic
 */
function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      const input = answer.toLowerCase().trim();
      resolve(input === "y" || input === "yes");
    });
  });
}

module.exports = resetCommand;

// const { hardResetDatabase } = require("../core/rag/vector");
// const { clearIndexState, isIndexed } = require("../core/ingest/indexState");

// /**
//  * CLI: reset command
//  */
// async function resetCommand() {
//   if (!isIndexed()) {
//     console.log("ℹ️ No existing index found.");
//     console.log("Nothing to reset.");
//     return;
//   }

//   console.log("🧹 Clearing indexed data...");
//   await hardResetDatabase();
//   clearIndexState();

//   console.log("✅ Index cleared successfully.");
// }

// module.exports = resetCommand;
