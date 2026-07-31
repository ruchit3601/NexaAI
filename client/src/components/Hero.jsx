import { motion } from "framer-motion";
import { modules } from "../data/modules";
import ModuleCard from "./ModuleCard";
import Navbar from "./Navbar";
import StatusBar from "./StatusBar";

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center px-6 py-20 max-w-5xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-semibold text-center mb-2"
        >
          AI Tools Lab
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-text-muted text-center mb-14 max-w-md font-mono text-sm"
        >
          A hands-on workbench for AI capabilities.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {modules.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} />
          ))}
        </div>

        <StatusBar />
      </section>
    </div>
  );
}