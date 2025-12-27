const fs = require("fs");
const path = require("path");
const retrieve = require("../core/rag/retrieve.js");
const getGlobalContext = require("../core/rag/getGlobalContext");
const generateAnswer = require("../core/llm/generate");
const readmeTasks = require("../core/llm/readmeTasks");

// /**
//  * CLI: readme command
//  */
// async function readmeCommand() {
//   console.log("📘 Generating README...");

//   // const contextChunks = await getGlobalContext();
//   const contextChunks = await retrieve(
//     "all the files which is important to the project readme file generation",
//     20
//   );

//   if (!contextChunks.length) {
//     console.log("❌ No indexed context found.");
//     console.log("Try re-indexing the repository.");
//     return;
//   }

//   const overview = await generateAnswer(readmeTasks.overview, contextChunks);

//   // const architecture = await generateAnswer(
//   //   readmeTasks.architecture,
//   //   contextChunks
//   // );

//   // const flow = await generateAnswer(readmeTasks.flow, contextChunks);

//   // const setup = await generateAnswer(readmeTasks.setup, contextChunks);

//   const readmeContent = `
// # Project Overview
// ${overview}

// `;

//   // # Architecture
//   // ${architecture}

//   // # Request Flow
//   // ${flow}

//   // # Setup & Run
//   // ${setup}

//   const outputPath = path.join(process.cwd(), "GENERATED_README2.md");
//   fs.writeFileSync(outputPath, readmeContent.trim());

//   console.log("✅ README generated successfully.");
//   console.log(`📄 File created: ${outputPath}`);
// }

async function readmeCommand() {
  console.log("📘 Reading Project Intelligence...");

  // Use the refined global context
  const contextChunks = await getGlobalContext();

  if (!contextChunks.length) {
    console.log("❌ No context found. Please run 'index' first.");
    return;
  }

  console.log(
    `🧠 Context Loaded: ${contextChunks.length} unique code segments.`
  );
  console.log("🤖 Generating Documentation...");

  const readmeTask = `
    # ROLE
    Expert Software Architect & Technical Writer.

    # OBJECTIVE
    Produce a high-density, deatiled-medium-length README.md based EXCLUSIVELY on the provided code. 
    Target Length: Concise, information-rich, approximately 300-500 words.

    # RULES (STRICT)
    1. NO HALLUCINATIONS: If a detail (like Installation steps) is not in the code, do not invent it. Write "Details not found in indexed context."
    2. NO MARKETING: No words like "amazing," "powerful," or "seamless." Use technical facts only.
    3. CONTEXT ONLY: Every sentence must be traceable back to a provided code chunk.
    4. MARKDOWN ONLY: No HTML. Use "###" for headings and "-" for lists.

    # SECTIONS TO GENERATE:
    ### 🚀 Overview
    A high-level technical summary of the system's purpose. (Max 150 words).

    ### 🏗️ System Architecture
    Describe the structural relationship between the identified modules (e.g., Entry Point -> Routes -> Controllers). Focus on the "Wiring."

    ### ⚙️ Core Logic & Flow
    Identify the most important function/class and explain its execution path. Use inline code backticks for variable names.

    ### 📁 Project Layout
    Explain the directory structure. Group files by their responsibility (e.g., Ingestion, Retrieval, Commands).

    ### 🔑 Environment & Config
    List the exact keys found in \`process.env\` or config calls. Do NOT suggest generic keys like DB_URL if not present.

    # FINAL CHECK:
    Is every statement backed by the code? If yes, generate output.
    `;

  // Instead of multiple calls, let's get the core content in one high-quality pass
  // to save on API latency (Frugal approach)
  //   const readmeTask = `
  // # ROLE
  // Technical Documentation Expert.

  // # STRICT MANDATE: ZERO ASSUMPTION
  // 1. Do NOT assume any features, URLs, or dependencies not present in the context.
  // 2. If the context does not show how to install or run the project, say "Refer to source code for setup" instead of guessing.
  // 3. Do NOT use a single word of "filler" text or generic marketing fluff.
  // 4. Use ONLY the provided code snippets and file tree to describe functionality.

  // # REQUIRED SECTIONS (Medium Length):
  // - **Project Overview**: What is this based on the files provided? (Max 2 paragraphs).
  // - **Core Architecture**: Describe the relationship between files (e.g., how the router connects to the controller).
  // - **Primary Logic**: Explain the main algorithms or data handling found in the code.
  // - **Project Structure**: Use the provided tree to explain the directory layout.
  // - **Environment**: List only the .env variables actually used in the code. no ASSUMPTION stictly

  // # FORMATTING:
  // - Use strictly Markdown (###, -, \`). No HTML.
  // - Specify code languages in blocks.
  // - Keep the total length around 500-700 words.
  // `;

  const fullDocumentation = await generateAnswer(readmeTask, contextChunks);
  // const fullDocumentation = await generateAnswer(
  //   "Generate a comprehensive README including Project Overview, Architecture, and File Structure.",
  //   contextChunks
  // );

  const readmeContent = `
# 🚀 Project Documentation
> Generated by **CodeSense** — *Local Code Intelligence*

${fullDocumentation}

---
Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
`;

  const outputPath = path.join(process.cwd(), "README_AI.md");
  fs.writeFileSync(outputPath, readmeContent.trim());

  console.log(`✅ README created at: ${outputPath}`);
}
module.exports = readmeCommand;
