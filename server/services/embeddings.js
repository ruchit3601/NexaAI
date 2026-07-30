const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

async function embedText(text) {
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function embedBatch(texts) {
  return Promise.all(texts.map(embedText));
}

module.exports = { embedText, embedBatch };