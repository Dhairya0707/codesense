const { searchVectors } = require("./vector.js");

async function getGlobalContext() {
  const topics = [
    "main entry point server configuration",
    "express api route definitions",
    "database schema and models",
    "business logic controllers",
    "environment variables and setup",
  ];

  const allChunks = [];
  const seenIds = new Set();

  for (const topic of topics) {
    // We search for top 4 to get a broader spread
    const results = await searchVectors(topic, 4);

    for (const r of results) {
      const meta = r.item.metadata;
      // Use the unique ID generated during chunking to prevent duplicates
      if (!seenIds.has(meta.id)) {
        seenIds.add(meta.id);

        // Ensure the object structure matches what buildContext expects
        allChunks.push({
          file: meta.file,
          role: meta.role,
          text: meta.text, // The actual content of the code chunk
        });
      }
    }
  }

  // Sort by file name so the LLM sees the project in a logical order
  return allChunks.sort((a, b) => a.file.localeCompare(b.file));
}
/**
 * Retrieves broad project context for documentation generation
//  */
// async function getGlobalContext() {
//   const topics = [
//     "server entry point",
//     "API routes",
//     "controllers and business logic",
//     "database models",
//     "configuration setup",
//   ];

//   const allChunks = [];
//   const seen = new Set();

//   for (const topic of topics) {
//     const results = await searchVectors(topic, 3);

//     for (const r of results) {
//       const meta = r.item.metadata;
//       if (!seen.has(meta.id)) {
//         seen.add(meta.id);
//         allChunks.push(meta);
//       }
//     }
//   }

//   return allChunks;
// }

module.exports = getGlobalContext;
