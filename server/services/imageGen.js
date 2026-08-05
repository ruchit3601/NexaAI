const HF_API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";
async function generateImage(prompt) {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const err = new Error(`Image generation failed: ${errText}`);
    err.status = response.status; // preserves 429, 503, etc.
    throw err;
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = response.headers.get("content-type") || "image/png";

  return { url: `data:${contentType};base64,${base64}` };
}

module.exports = { generateImage };