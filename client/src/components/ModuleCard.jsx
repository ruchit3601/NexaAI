import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ModuleCard({ module, index }) {
  const isOnline = module.status === "ONLINE";
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: "easeOut" }}
      onClick={() => module.route && navigate(module.route)}
      className="bg-surface rounded-md p-5 border border-border hover:border-border-hover transition-colors cursor-pointer flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-ink-muted bg-surface tracking-wide">{module.tag}</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-online" : "bg-beta"}`} />
          <span className="font-mono text-[10px] text-ink-muted bg-surface">{module.status}</span>
        </span>
      </div>
      <h3 className="text-base font-medium">{module.name}</h3>
      <p className="text-sm text-ink-muted bg-surface leading-relaxed">{module.description}</p>
    </motion.div>
  );
}