import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Wand2, ImageIcon } from "lucide-react";
import PageLayout from "../components/PageLayout";

const API_BASE = "http://localhost:5000/api/image";

const loadingMessages = [
  "Understanding your vision...",
  "Mixing creativity and intelligence...",
  "Painting pixels with AI...",
  "Adding final details...",
  "Almost ready...",
];

const suggestions = ["Cyberpunk city at night", "Fantasy mountain landscape", "Futuristic AI robot"];

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (!loading) return;
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 1800);
    return () => clearInterval(timer);
  }, [loading]);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setImage(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image generation failed");
      setImage(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout title="AI Image Studio" subtitle="Powered by Pollinations — free, open-source text-to-image">
      <form onSubmit={handleGenerate} className="flex gap-3 bg-surface border border-border rounded-md p-3 mb-4">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your dream image..."
          className="flex-1 bg-transparent px-2 outline-none text-sm"
        />
        <button
          disabled={loading}
          className="px-5 rounded-md bg-accent/15 border border-accent/40 hover:bg-accent/25 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {suggestions.map((item) => (
          <button
            key={item}
            onClick={() => setPrompt(item)}
            className="px-3 py-1.5 rounded-full text-xs border border-border bg-surface hover:border-border-hover transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">✕ {error}</p>}

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[420px] rounded-md border border-border bg-surface flex flex-col items-center justify-center"
          >
            <Sparkles size={40} className="text-accent animate-pulse" />
            <p className="mt-6 font-mono text-sm">{loadingMessage}</p>
          </motion.div>
        )}

        {!loading && !image && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[360px] rounded-md border border-border bg-surface flex items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-md flex items-center justify-center bg-accent/15">
                <ImageIcon size={32} className="text-accent" />
              </div>
              <h2 className="text-lg font-medium">Your image will appear here</h2>
              <p className="text-sm text-ink-muted mt-2">Describe anything to generate it</p>
            </div>
          </motion.div>
        )}

        {image && (
          <motion.div
            key="image"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md overflow-hidden border border-border"
          >
            <img src={image} alt={prompt} className="w-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}