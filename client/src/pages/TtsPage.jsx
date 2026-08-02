import { useState, useEffect, useRef } from "react";
import { Volume2, Square } from "lucide-react";
import PageLayout from "../components/PageLayout";

export default function TtsPage() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if(!window.speechSynthesis) return;
    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length) setVoices(available);
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  function handleSpeak(e) {
    e.preventDefault();
    if (!text.trim() || !window.speechSynthesis) return;

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
    <PageLayout title="Text to Speech" subtitle="Browser-native Web Speech API — zero API cost, works fully offline">
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
    </PageLayout>
  );
}