const { ChromaClient } = require('chromadb');
const { embedBatch, embedText } = require('./embeddings');

const client = new ChromaClient({ path: 'http://localhost:8000' });

async function getOrCreateCollection(name) {
  return client.getOrCreateCollection({ name });
}

async function storeChunks(collectionName, chunks, docId) {
  const collection = await getOrCreateCollection(collectionName);
  const embeddings = await embedBatch(chunks);
  const ids = chunks.map((_, i) => `${docId}-chunk-${i}`);

  await collection.add({
    ids,
    embeddings,
    documents: chunks,
    metadatas: chunks.map(() => ({ docId })),
  });

  return ids.length;
}

async function queryRelevantChunks(collectionName, question, docId, topK = 4) {
  const collection = await getOrCreateCollection(collectionName);
  const queryEmbedding = await embedText(question);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    where: docId ? { docId } : undefined,
  });

  return results.documents[0];
}
module.exports = { storeChunks, queryRelevantChunks };