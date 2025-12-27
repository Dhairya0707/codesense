const { LocalIndex } = require("vectra");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const fs = require("fs");

const genAI = new GoogleGenerativeAI("AIzaSyCdusAClk7Jnb4y9liVOhA_sNglROVEQwk");
const ai = genAI.getGenerativeModel({ model: "text-embedding-004" });
const indexDir = path.join(process.cwd(), "vectordb");
// const index = new LocalIndex(indexDir);
const getStorePaths = require("../utils/getStorePaths.js");

let index = null;

function getIndex() {
  if (!index) {
    const { vectorDir } = getStorePaths();
    index = new LocalIndex(vectorDir);
  }
  return index;
}

async function getEmbedding(text, type = "RETRIEVAL_DOCUMENT") {
  try {
    const result = await ai.embedContent({
      content: { parts: [{ text }] },
      taskType: type,
    });
    return result.embedding.values;
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
}

async function storeText(text, metadata = {}) {
  const index = getIndex();

  if (!(await index.isIndexCreated())) {
    await index.createIndex();
  }
  // if (!(await index.isIndexCreated())) await index.createIndex();

  const vector = await getEmbedding(text);
  await index.insertItem({
    vector: vector,
    metadata: { ...metadata, text }, // Merging text into metadata for retrieval
  });
  return { success: true, text };
}

async function searchVectors(queryText, limit = 3) {
  const index = getIndex();
  if (!(await index.isIndexCreated())) return [];

  const queryVector = await getEmbedding(queryText);
  const results = await index.queryItems(queryVector, limit);
  return results;
}

async function hardResetDatabase() {
  const { baseDir } = getStorePaths();
  if (fs.existsSync(baseDir)) {
    fs.rmSync(baseDir, { recursive: true, force: true });
    console.log("Vector store folder deleted from disk.");
  }
}

// async function hardResetDatabase() {
//   if (fs.existsSync(indexDir)) {
//     fs.rmSync(indexDir, { recursive: true, force: true });
//     console.log("Vector store folder deleted from disk.");
//   }
// }

module.exports = { getEmbedding, storeText, searchVectors, hardResetDatabase };
