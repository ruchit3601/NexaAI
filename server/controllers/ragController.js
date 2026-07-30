const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const { chunkText } = require('../services/chunker');
const { storeChunks, queryRelevantChunks } = require('../services/vectorStore');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
async function uploadDocument(req, res) {
  let parser;
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const dataBuffer = fs.readFileSync(req.file.path);
    parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();

    const chunks = chunkText(result.text);
    const docId = req.file.filename;

    const count = await storeChunks('documents', chunks, docId);
    fs.unlinkSync(req.file.path);

    res.json({ docId, chunksStored: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process document' });
  } finally {
    if (parser) await parser.destroy();
  }
}

async function askQuestion(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided' });

    const relevantChunks = await queryRelevantChunks('documents', question);
    const context = relevantChunks.join('\n\n');

    const prompt = `Answer the question using only the context below. If the answer isn't in the context, say so.\n\nContext:\n${context}\n\nQuestion: ${question}`;
    const result = await chatModel.generateContent(prompt);

    res.json({ answer: result.response.text(), sources: relevantChunks });
  } catch (err) {
    console.error(err);
    if (err.status === 429) {
      return res.status(429).json({
        error: 'Rate limit reached on the free tier. Please wait a moment and try again.',
      });
    }
    res.status(500).json({ error: 'Failed to answer question' });
  }
}

module.exports = { uploadDocument, askQuestion };