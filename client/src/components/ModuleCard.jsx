import { motion } from "framer-motion";

export default function ModuleCard({ module, index }) {
  const isOnline = module.status === "ONLINE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.4 }}
      className="bg-deep-slate rounded-lg p-5 w-56 border border-muted-steel/20 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-steel">{module.tag}</span>
        <span className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-circuit-teal" : "bg-signal-amber"}`}
          />
          <span className="font-mono text-[10px] text-muted-steel">{module.status}</span>
        </span>
      </div>
      <h3 className="font-display text-lg font-medium">{module.name}</h3>
      <p className="text-sm text-muted-steel">{module.description}</p>
    </motion.div>
  );
}