const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

async function analyzeImage(base64Data, mimeType, prompt) {
  const result = await model.generateContent([
    { inlineData: { data: base64Data, mimeType } },
    { text: prompt || 'Describe this image in detail.' },
  ]);
  return result.response.text();
}

module.exports = { analyzeImage };