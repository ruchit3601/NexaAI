import { motion } from "framer-motion";

export default function ModuleCard({ module, index }) {
  const isOnline = module.status === "ONLINE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: `0 0 20px ${module.accent}33` }}
      transition={{ delay: 0.6 + index * 0.15, duration: 0.4 }}
      style={{ borderLeftColor: module.accent }}
      className="bg-deep-slate rounded-lg p-5 w-56 border-l-4 border-y border-r border-muted-steel/10 flex flex-col gap-3 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-steel">{module.tag}</span>
        <span className="flex items-center gap-1.5">
          <motion.span
            className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-circuit-teal" : "bg-signal-amber"}`}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-mono text-[10px] text-muted-steel">{module.status}</span>
        </span>
      </div>
      <h3 className="font-display text-lg font-medium">{module.name}</h3>
      <p className="text-sm text-muted-steel">{module.description}</p>
    </motion.div>
  );
}