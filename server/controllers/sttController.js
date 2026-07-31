const fs = require('fs');
const { transcribeAudio } = require('../services/speechToText');

async function transcribe(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

    const text = await transcribeAudio(req.file.path);
    fs.unlinkSync(req.file.path);

    res.json({ text });
  } catch (err) {
    console.error(err);
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached on the free tier. Please wait a moment and try again.' });
    }
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
}

module.exports = { transcribe };