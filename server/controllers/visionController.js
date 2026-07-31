const fs = require('fs');
const { analyzeImage } = require('../services/vision');

async function analyze(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const base64Data = fs.readFileSync(req.file.path).toString('base64');
    const { prompt } = req.body;

    const description = await analyzeImage(base64Data, req.file.mimetype, prompt);
    fs.unlinkSync(req.file.path);

    res.json({ description });
  } catch (err) {
    console.error(err);
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached on the free tier. Please wait a moment and try again.' });
    }
    res.status(500).json({ error: 'Failed to analyze image' });
  }
}

module.exports = { analyze };