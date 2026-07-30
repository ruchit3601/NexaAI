import { ExternalLink } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-5 border-b border-muted-steel/10">
      <span className="font-mono text-sm text-circuit-teal tracking-wider">
        AI_TOOLS_LAB
      </span>
      <a
        href="https://github.com/ruchit3601/ai-tools-lab"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-muted-steel hover:text-bone-white transition-colors text-sm"
      >
        <span>Source</span>
        <ExternalLink size={14} />
      </a>
    </nav>
  );
}