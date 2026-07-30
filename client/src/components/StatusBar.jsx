import { modules } from "../data/modules";

export default function StatusBar() {
  const onlineCount = modules.filter((m) => m.status === "ONLINE").length;

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 flex items-center justify-center gap-8 font-mono text-xs text-muted-steel border-t border-muted-steel/10 pt-6">
      <span>MODULES: {modules.length}</span>
      <span className="text-circuit-teal">● {onlineCount} ONLINE</span>
      <span>STACK: REACT / NODE / GEMINI / GROQ</span>
    </div>
  );
}