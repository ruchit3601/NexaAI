import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Volume2, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TtsPage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length) setVoices(available);
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function handleSpeak(e) {
    e.preventDefault();
    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[voiceIndex]) utterance.voice = voices[voiceIndex];
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors text-sm mb-8 w-fit"
      >
        <ArrowLeft size={16} />
        Back to Lab
      </button>

      <h1 className="text-3xl font-semibold mb-2">Text to Speech</h1>
      <p className="text-ink-muted font-mono text-sm mb-10">Browser-native Web Speech API — zero API cost, works fully offline</p>

      <form onSubmit={handleSpeak} className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Type something to hear it spoken..."
          className="bg-surface border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-border-hover transition-colors resize-none"
        />

        {voices.length > 0 && (
          <select
            value={voiceIndex}
            onChange={(e) => setVoiceIndex(Number(e.target.value))}
            className="bg-surface border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-border-hover transition-colors"
          >
            {voices.map((v, i) => (
              <option key={v.name} value={i}>{v.name} ({v.lang})</option>
            ))}
          </select>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-accent/15 border border-accent/40 rounded-md px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent/25 transition-colors disabled:opacity-50"
          >
            <Volume2 size={16} />
            Speak
          </button>
          {speaking && (
            <button
              type="button"
              onClick={handleStop}
              className="bg-surface border border-border rounded-md px-4 py-2 text-sm flex items-center gap-2 hover:border-border-hover transition-colors"
            >
              <Square size={14} />
              Stop
            </button>
          )}
        </div>
      </form>
    </div>
  );
}