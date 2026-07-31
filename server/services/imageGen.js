const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function generateImage(prompt) {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const seed = Math.floor(Math.random() * 100000);

  const imageUrl = 
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}`;

  return {
    url: imageUrl,
  };
// }

// module.exports = { generateImage };

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.error?.message || 'Image generation failed');
    err.status = response.status;
    throw err;
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) throw new Error('No image returned by the model');

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}

module.exports = { generateImage };