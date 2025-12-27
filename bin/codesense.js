#!/usr/bin/env node
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  quiet: true,
});

// Index state
const { isIndexed } = require("../core/ingest/indexState.js");

// CLI commands
const indexCommand = require("../commands/index.js");
const askCommand = require("../commands/ask.js");
const readmeCommand = require("../commands/readme.js");
const resetCommand = require("../commands/reset.js");
const statusCommand = require("../commands/status.js");
const ensureEnv = require("../core/utils/ensureenv.js");
const initCommand = require("../commands/init.js");
// CLI args
const [, , command, ...args] = process.argv;

function printUsage() {
  console.log(`
\x1b[1m\x1b[32mCodeSense\x1b[0m — \x1b[2mLocal Code Intelligence\x1b[0m

\x1b[1mUSAGE:\x1b[0m
  $ codesense <command> [arguments]

\x1b[1mCORE COMMANDS:\x1b[0m
  \x1b[36minit\x1b[0m          Configure your Gemini API key (stored in local .env)
  \x1b[36mindex\x1b[0m         Scan, chunk, and embed your codebase into a local vector DB
  \x1b[36mask\x1b[0m           Query your codebase using natural language (RAG)
  \x1b[36mreadme\x1b[0m        Generate a comprehensive, context-aware README.md
  \x1b[36mstatus\x1b[0m        Check if the current repository is indexed
  \x1b[36mreset\x1b[0m         Wipe the local vector database and index state

\x1b[1mWORKFLOW:\x1b[0m
  1. \x1b[33mcodesense init\x1b[0m      (First time only)
  2. \x1b[33mcodesense index\x1b[0m     (Run whenever code changes significantly)
  3. \x1b[33mcodesense ask "..."\x1b[0m (Start chatting with your code)

\x1b[1mEXAMPLES:\x1b[0m
  $ codesense ask "Where is the user registration logic handled?"
  $ codesense ask "Explain the middleware flow in server.js"
  $ codesense readme

\x1b[2mNote: CodeSense runs 100% offline for retrieval; only embeddings/LLM use the Gemini API.\x1b[0m
`);
}

/* ------------------------------
   Command guard (IMPORTANT)
-------------------------------- */
if (!command) {
  printUsage();
  process.exit(0);
}
/* ------------------------------
   Environment guard
-------------------------------- */
if (command !== "init") {
  ensureEnv(); // checks process.env.GEMINI_API_KEY
}

// Any command except index requires an existing index
if (command !== "index" && !isIndexed()) {
  console.log("❌ No index found in this directory.");
  console.log("👉 Run `codesense index` first.");
  process.exit(1);
}

/* ------------------------------
   Command router
-------------------------------- */
(async () => {
  try {
    switch (command) {
      case "init":
        await initCommand();
        break;

      case "index": {
        await indexCommand();
        break;
      }

      case "ask": {
        const question = args.join(" ").trim();
        if (!question) {
          console.log("❌ Please provide a question.");
          console.log(`Example: codesense ask "How does auth work?"`);
          process.exit(1);
        }

        await askCommand(question);
        break;
      }

      case "readme": {
        await readmeCommand();
        break;
      }

      case "reset": {
        await resetCommand();
        break;
      }
      case "status": {
        statusCommand();
        break;
      }

      default:
        console.log(`❌ Unknown command: ${command}`);
        printUsage();
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
