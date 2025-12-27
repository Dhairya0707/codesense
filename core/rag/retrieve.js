const { searchVectors } = require("./vector");

/**
 * Retrieve relevant chunks for a query
 */
async function retrieve(query, limit = 4) {
  const results = await searchVectors(query, limit);
  return results.map((r) => r.item.metadata);
}

module.exports = retrieve;
