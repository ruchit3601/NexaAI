const { embedBatch, embedText } = require('./embeddings');

// In-memory store: array of { docId, chunk, embedding }
// Resets whenever the server restarts — acceptable for this project's
// per-session usage pattern (see SECURITY.md-style note below).
let store = [];

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function storeChunks(collectionName, chunks, docId) {
  const embeddings = await embedBatch(chunks);

  chunks.forEach((chunk, i) => {
    store.push({ docId, chunk, embedding: embeddings[i] });
  });

  return chunks.length;
}

async function queryRelevantChunks(collectionName, question, docId, topK = 4) {
  const queryEmbedding = await embedText(question);

  const candidates = docId ? store.filter((entry) => entry.docId === docId) : store;

  const scored = candidates.map((entry) => ({
    chunk: entry.chunk,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map((entry) => entry.chunk);
}

module.exports = { storeChunks, queryRelevantChunks };