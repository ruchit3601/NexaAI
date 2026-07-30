import { motion } from "framer-motion";

export default function ConnectionLines({ count }) {
  const width = 1400;
  const hubX = width / 2;
  const hubY = 20;
  const cardY = 140;

  return (
    <svg
      viewBox={`0 0 ${width} 160`}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] pointer-events-none overflow-visible"
    >
      {Array.from({ length: count }).map((_, i) => {
        const targetX = (width / count) * (i + 0.5);
        return (
          <g key={i}>
            <motion.line
              x1={hubX} y1={hubY} x2={targetX} y2={cardY}
              stroke="#4FD1C5" strokeWidth="2" opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "easeOut" }}
            />
            <motion.circle
              r="3" fill="#4FD1C5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 0] }}
              transition={{ delay: 1.2 + i * 0.2, duration: 1.4, repeat: Infinity, repeatDelay: 2 }}
              style={{ offsetPath: `path("M${hubX},${hubY} L${targetX},${cardY}")` }}
            />
          </g>
        );
      })}
      <motion.circle cx={hubX} cy={hubY} r="10" fill="#F2A93B" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} />
      <motion.circle
        cx={hubX} cy={hubY} r="10" fill="none" stroke="#F2A93B" strokeWidth="1.5"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
    </svg>
  );
}