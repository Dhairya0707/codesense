const retrieve = require("../core/rag/retrieve.js");
const generateAnswer = require("../core/llm/generate.js");
const { marked } = require("marked");
const { default: TerminalRenderer } = require("marked-terminal");

marked.setOptions({
  renderer: new TerminalRenderer({}),
});

async function askCommand(question) {
  console.log("\n🔎 " + "\x1b[36mSearching relevant code...\x1b[0m");

  const contextChunks = await retrieve(question, 4);

  if (!contextChunks.length) {
    console.log("\x1b[31m⚠️  No relevant code context found.\x1b[0m");
    console.log(
      "👉 Suggestion: Run \x1b[33mcodesense index\x1b[0m to refresh your local data."
    );
    return;
  }

  const sourceFiles = [...new Set(contextChunks.map((c) => c.file))];
  console.log(`📂 \x1b[2mFound context in: ${sourceFiles.join(", ")}\x1b[0m`);

  console.log("🤖 \x1b[33mGenerating response via Gemini...\x1b[0m");

  const answer = await generateAnswer(question, contextChunks);

  const hr = "─".repeat(Math.min(process.stdout.columns || 50, 80));

  console.log("\n" + hr);
  console.log("💡 CODE INTELLIGENCE ANS :");
  console.log(hr);
  // This will render markdown to look beautiful in CMD/Terminal
  console.log(marked(answer));
  console.log(hr + "\n");
}

module.exports = askCommand;
