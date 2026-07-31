import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import PageLayout from "../components/PageLayout";

const API_BASE = "http://localhost:5000/api/vision";

export default function VisionPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setDescription("");
    setError(null);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    if (prompt.trim()) formData.append("prompt", prompt);

    try {
      const res = await fetch(`${API_BASE}/analyze`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setDescription(data.description);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout title="Vision" subtitle="Gemini — image understanding">
      <label className="border border-dashed border-border rounded-md p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-border-hover transition-colors mb-4">
        <Upload size={18} className="text-ink-muted" />
        <span className="text-sm text-ink-muted">{file ? file.name : "Click to upload an image"}</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {preview && <img src={preview} alt="Preview" className="rounded-md border border-border mb-4 max-h-80 object-contain" />}

      {file && (
        <div className="flex gap-2 mb-4">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Optional: ask something specific about the image..."
            className="flex-1 bg-surface border border-border rounded-md px-4 py-2 text-sm outline-none focus:border-border-hover transition-colors"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-accent/15 border border-accent/40 rounded-md px-4 flex items-center justify-center hover:bg-accent/25 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Analyze"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-400 font-mono mb-4">✕ {error}</p>}

      {description && (
        <div className="bg-surface border border-border rounded-md p-5">
          <p className="text-sm leading-relaxed">{description}</p>
        </div>
      )}
    </PageLayout>
  );
}