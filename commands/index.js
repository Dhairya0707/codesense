const fs = require("fs");
const scanRepo = require("../core/ingest/scanRepo");
const filterFiles = require("../core/ingest/filter");
const chunkFiles = require("../core/chunk/chunker");
const { storeText, hardResetDatabase } = require("../core/rag/vector");
const { isIndexed, writeIndexState } = require("../core/ingest/indexState");

async function indexCommand() {
  const repoPath = process.cwd();
  const startTime = Date.now(); // Start timer for polish

  if (isIndexed()) {
    console.log("\n⚠️  \x1b[33mExisting index detected.\x1b[0m");
    const answer = await askConfirmation(
      "👉 Re-index and overwrite existing data? (y/N): "
    );
    if (!answer) {
      console.log("❌ Indexing cancelled.");
      process.exit(0);
    }
    await hardResetDatabase();
  }

  console.log("\n🚀 \x1b[1mStarting Codebase Analysis\x1b[0m");

  // 1. Scan & Filter
  const scannedFiles = scanRepo(repoPath);
  const filteredFiles = filterFiles(scannedFiles);
  console.log(
    `🔍 Found ${filteredFiles.length} files \x1b[2m(${
      scannedFiles.length - filteredFiles.length
    } ignored)\x1b[0m`
  );

  // 2. Chunk
  const chunks = chunkFiles(filteredFiles);
  console.log(`🧩 Processed into ${chunks.length} semantic segments.`);

  // 3. Vector Storage (The "Heavy" part)
  console.log(`📦 \x1b[36mSyncing to Local Vector DB...\x1b[0m`);

  let current = 0;
  for (const chunk of chunks) {
    current++;

    // API Call
    await storeText(chunk.content, {
      id: chunk.id,
      role: chunk.role,
      file: chunk.file,
    });

    // POLISH: Moving the progress inside the loop so it actually updates
    if (current % 1 === 0 || current === chunks.length) {
      const percentage = Math.round((current / chunks.length) * 100);
      process.stdout.write(
        `\r   \x1b[2mProgress: [${current}/${chunks.length}] ${percentage}%\x1b[0m`
      );
    }
  }

  writeIndexState();

  // POLISH: Show total time taken
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `\n\n✅ \x1b[32mIndexing successful!\x1b[0m \x1b[2m(${duration}s)\x1b[0m`
  );
  console.log("✨ Your codebase is now searchable offline.");
}

/* ----------------------------------
   Small helper: CLI confirmation
----------------------------------- */
function askConfirmation(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      process.stdin.pause();
      const input = data.toString().trim().toLowerCase();
      resolve(input === "y" || input === "yes");
    });
  });
}

module.exports = indexCommand;
// const fs = require("fs");

// const scanRepo = require("../core/ingest/scanRepo");
// const filterFiles = require("../core/ingest/filter");
// const chunkFiles = require("../core/chunk/chunker");
// const { storeText, hardResetDatabase } = require("../core/rag/vector");
// const { isIndexed, writeIndexState } = require("../core/ingest/indexState");

// async function indexCommand() {
//   // Safety check
//   const repoPath = process.cwd();
//   if (!fs.existsSync(repoPath)) {
//     console.log("❌ Provided path does not exist.");
//     process.exit(1);
//   }

//   // Re-index confirmation
//   if (isIndexed()) {
//     console.log("⚠️ Repository already indexed.");
//     console.log("⚠️ Re-indexing will overwrite existing data.");

//     const answer = await askConfirmation("Proceed? (y/N): ");
//     if (!answer) {
//       console.log("❌ Indexing cancelled.");
//       process.exit(0);
//     }

//     await hardResetDatabase();
//   }

//   const scannedFiles = scanRepo(repoPath);
//   console.log(`🔍 Scan complete: Found ${scannedFiles.length} raw files.`);

//   //   console.log("🧹 Filtering files...");
//   const filteredFiles = filterFiles(scannedFiles);
//   const ignoredCount = scannedFiles.length - filteredFiles.length;
//   console.log(
//     `🧹 Filter complete: Keeping ${filteredFiles.length} relevant files (${ignoredCount} ignored).`
//   );

//   const chunks = chunkFiles(filteredFiles);
//   console.log(
//     `🧩 Chunking complete: Generated ${chunks.length} total segments.`
//   );

//   console.log(`📦 Storing ${chunks.length} chunks...`);
//   let current = 0;
//   for (const chunk of chunks) {
//     current++;
//     await storeText(chunk.content, {
//       id: chunk.id,
//       role: chunk.role,
//       file: chunk.file,
//     });
//   }
//   if (current % 5 === 0 || current === chunks.length) {
//     process.stdout.write(
//       `\r   Progress: [${current}/${chunks.length}] chunks stored...`
//     );
//   }

//   writeIndexState();

//   console.log(
//     "\n\n✅ Indexing successful! Your codebase is now searchable offline."
//   );
// }

// /* ----------------------------------
//    Small helper: CLI confirmation
// ----------------------------------- */
// function askConfirmation(question) {
//   return new Promise((resolve) => {
//     process.stdout.write(question);
//     process.stdin.resume();
//     process.stdin.once("data", (data) => {
//       process.stdin.pause();
//       const input = data.toString().trim().toLowerCase();
//       resolve(input === "y" || input === "yes");
//     });
//   });
// }

// module.exports = indexCommand;
