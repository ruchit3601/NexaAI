import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AmbientBackground from "../components/AmbientBackground";
import Particles from "../components/Particles";

const API_BASE = "http://localhost:5000/api/image";

export default function ImagePage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setImage(`data:${data.mimeType};base64,${data.image}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-3xl mx-auto">
      <AmbientBackground />
      <Particles count={15} />

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-muted-steel hover:text-bone-white transition-colors text-sm mb-8 w-fit"
      >
        <ArrowLeft size={16} />
        Back to Lab
      </button>

      <h1 className="font-display text-3xl font-bold mb-2">Image Generation</h1>
      <p className="text-muted-steel font-mono text-sm mb-8">Gemini — text-to-image</p>

      <form onSubmit={handleGenerate} className="flex gap-2 mb-8">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want..."
          className="flex-1 bg-glass-surface backdrop-blur-md rounded-lg px-4 py-3 text-sm outline-none border border-white/5 focus:border-violet-accent/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-accent/20 border border-violet-accent/40 rounded-lg px-4 flex items-center justify-center hover:bg-violet-accent/30 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        </button>
      </form>

      {error && <p className="text-sm text-red-400 font-mono mb-4">✕ {error}</p>}

      {image && (
        <motion.img
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          src={image}
          alt={prompt}
          className="rounded-lg border border-white/5 w-full"
        />
      )}
    </div>
  );
}