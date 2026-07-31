import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors text-sm mb-8 w-fit"
      >
        <ArrowLeft size={16} />
        Back to Lab
      </button>

      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      <p className="text-ink-muted font-mono text-sm mb-10">{subtitle}</p>

      {children}
    </div>
  );
}