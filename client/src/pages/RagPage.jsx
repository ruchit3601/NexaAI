import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Send, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AmbientBackground from "../components/AmbientBackground";
import Particles from "../components/Particles";

const API_BASE = "http://localhost:5000/api/rag";

export default function RagPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [docId, setDocId] = useState(null);

  async function handleUpload(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", selected);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      //   setUploadStatus({ ok: true, chunks: data.chunksStored });
      setDocId(data.docId);
      setUploadStatus({ ok: true, chunks: data.chunksStored });
    } catch (err) {
      setUploadStatus({ ok: false, message: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setAsking(true);

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ question: userMsg.text }),
        body: JSON.stringify({ question: userMsg.text, docId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get an answer");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "error", text: err.message }]);
    } finally {
      setAsking(false);
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

      <h1 className="font-display text-3xl font-bold mb-2">Document Q&A</h1>
      <p className="text-muted-steel font-mono text-sm mb-8">
        RAG — retrieval-augmented generation over your own PDFs
      </p>

      <label className="border border-dashed border-white/15 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-cyan-glow/50 transition-colors mb-4">
        <Upload size={20} className="text-cyan-glow" />
        <span className="text-sm text-muted-steel">
          {file ? file.name : "Click to upload a PDF"}
        </span>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {uploading && (
        <p className="flex items-center gap-2 text-sm text-muted-steel font-mono mb-4">
          <Loader2 size={14} className="animate-spin" /> Processing document...
        </p>
      )}
      {uploadStatus?.ok && (
        <p className="text-sm text-circuit-glow font-mono mb-4">
          ✓ Stored {uploadStatus.chunks} chunks — ready for questions.
        </p>
      )}
      {uploadStatus?.ok === false && (
        <p className="text-sm text-red-400 font-mono mb-4">
          ✕ {uploadStatus.message}
        </p>
      )}

      <div className="flex-1 flex flex-col gap-4 mb-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-glass-surface self-end ml-12"
                : msg.role === "error"
                  ? "bg-red-500/10 text-red-300"
                  : "bg-glass-surface backdrop-blur-md mr-12"
            }`}
          >
            {msg.text}
            {msg.sources && (
              <details className="mt-2 text-xs text-muted-steel font-mono">
                <summary className="cursor-pointer">
                  Sources ({msg.sources.length})
                </summary>
                {msg.sources.map((s, j) => (
                  <p key={j} className="mt-1 opacity-70 line-clamp-2">
                    {s.slice(0, 150)}...
                  </p>
                ))}
              </details>
            )}
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your document..."
          className="flex-1 bg-glass-surface backdrop-blur-md rounded-lg px-4 py-3 text-sm outline-none border border-white/5 focus:border-cyan-glow/50 transition-colors"
        />
        <button
          type="submit"
          disabled={asking}
          className="bg-cyan-glow/20 border border-cyan-glow/40 rounded-lg px-4 flex items-center justify-center hover:bg-cyan-glow/30 transition-colors disabled:opacity-50"
        >
          {asking ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
}
