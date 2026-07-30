import { motion } from "framer-motion";
import { modules } from "../data/modules";
import ModuleCard from "./ModuleCard";
import ConnectionLines from "./ConnectionLines";
import Navbar from "./Navbar";
import StatusBar from "./StatusBar";
import AmbientBackground from "./AmbientBackground";
import Particles from "./Particles";

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AmbientBackground />
      <Particles />
      <section className="flex-1 flex flex-col items-center justify-center px-10 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl md:text-5xl font-bold text-center mb-3"
        >
          AI Tools Lab
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-muted-steel text-center mb-16 max-w-md font-mono text-sm"
        >
          A hands-on workbench for AI capabilities — plug in, try it live, see how it works.
        </motion.p>

        <div className="relative w-full max-w-[1400px]">
          <ConnectionLines count={modules.length} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-36">
            {modules.map((module, i) => (
              <ModuleCard key={module.id} module={module} index={i} />
            ))}
          </div>
        </div>

        <StatusBar />
      </section>
    </div>
  );
}