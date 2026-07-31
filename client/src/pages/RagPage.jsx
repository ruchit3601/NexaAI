import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Send, Loader2 } from "lucide-react";
import PageLayout from "../components/PageLayout";

const API_BASE = "http://localhost:5000/api/rag";

export default function RagPage() {
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
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
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
        body: JSON.stringify({ question: userMsg.text, docId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get an answer");
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer, sources: data.sources }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "error", text: err.message }]);
    } finally {
      setAsking(false);
    }
  }

  return (
    <PageLayout title="Document Q&A" subtitle="RAG — retrieval-augmented generation over your own PDFs">
      <label className="border border-dashed border-border rounded-md p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-border-hover transition-colors mb-4">
        <Upload size={20} className="text-accent" />
        <span className="text-sm text-ink-muted">
          {file ? file.name : "Click to upload a PDF"}
        </span>
        <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
      </label>

      {uploading && (
        <p className="flex items-center gap-2 text-sm text-ink-muted font-mono mb-4">
          <Loader2 size={14} className="animate-spin" /> Processing document...
        </p>
      )}
      {uploadStatus?.ok && (
        <p className="text-sm text-online font-mono mb-4">
          ✓ Stored {uploadStatus.chunks} chunks — ready for questions.
        </p>
      )}
      {uploadStatus?.ok === false && (
        <p className="text-sm text-red-400 font-mono mb-4">✕ {uploadStatus.message}</p>
      )}

      <div className="flex-1 flex flex-col gap-4 mb-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-md text-sm border border-border ${
              msg.role === "user"
                ? "bg-surface self-end ml-12"
                : msg.role === "error"
                ? "bg-red-500/10 text-red-300 border-red-500/20"
                : "bg-surface mr-12"
            }`}
          >
            {msg.text}
            {msg.sources && (
              <details className="mt-2 text-xs text-ink-muted font-mono">
                <summary className="cursor-pointer">Sources ({msg.sources.length})</summary>
                {msg.sources.map((s, j) => (
                  <p key={j} className="mt-1 opacity-70 line-clamp-2">{s.slice(0, 150)}...</p>
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
          className="flex-1 bg-surface rounded-md px-4 py-3 text-sm outline-none border border-border focus:border-border-hover transition-colors"
        />
        <button
          type="submit"
          disabled={asking}
          className="bg-accent/15 border border-accent/40 rounded-md px-4 flex items-center justify-center hover:bg-accent/25 transition-colors disabled:opacity-50"
        >
          {asking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </PageLayout>
  );
}