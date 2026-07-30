import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Particles({ count = 25 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const list = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 12 + Math.random() * 10,
      size: 1 + Math.random() * 2,
    }));
    setParticles(list);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-glow"
          style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, bottom: '-10px' }}
          animate={{ y: ["0vh", "-110vh"], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}