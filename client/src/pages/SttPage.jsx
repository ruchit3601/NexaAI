import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import PageLayout from "../components/PageLayout";

const API_BASE = "http://localhost:5000/api/stt";

export default function SttPage() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    setError(null);
    setTranscript("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendForTranscription(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Microphone access denied or unavailable.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function sendForTranscription(blob) {
    setTranscribing(true);
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      const res = await fetch(`${API_BASE}/transcribe`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transcription failed");
      setTranscript(data.text);
    } catch (err) {
      setError(err.message);
    } finally {
      setTranscribing(false);
    }
  }

  return (
    <PageLayout title="Speech to Text" subtitle="Groq Whisper — real-time audio transcription">
      <div className="flex flex-col items-center gap-6 py-16">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={transcribing}
          className={`w-20 h-20 rounded-full flex items-center justify-center border transition-colors ${
            recording ? "bg-red-500/10 border-red-500/40 text-red-400" : "bg-surface border-border hover:border-border-hover text-ink"
          } disabled:opacity-50`}
        >
          {transcribing ? <Loader2 size={24} className="animate-spin" /> : recording ? <Square size={22} /> : <Mic size={24} />}
        </button>
        <p className="text-sm text-ink-muted font-mono">
          {transcribing ? "Transcribing..." : recording ? "Recording — click to stop" : "Click to record"}
        </p>
      </div>

      {error && <p className="text-sm text-red-400 font-mono mb-4">✕ {error}</p>}

      {transcript && (
        <div className="bg-surface border border-border rounded-md p-5">
          <p className="text-sm leading-relaxed">{transcript}</p>
        </div>
      )}
    </PageLayout>
  );
}