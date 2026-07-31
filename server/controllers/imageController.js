const { generateImage } = require('../services/imageGen');

async function createImage(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

    const { url } = await generateImage(prompt);

res.json({
  image: url,
});
  } catch (err) {
    console.error(err);
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached on the free tier. Please wait a moment and try again.' });
    }
    res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
}

module.exports = { createImage };