import { motion } from "framer-motion";

export default function ConnectionLines({ count }) {
  const width = 900;
  const hubX = width / 2;
  const hubY = 20;
  const cardY = 140;
  const spacing = width / (count + 1);

  return (
    <svg
      viewBox={`0 0 ${width} 160`}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl pointer-events-none"
    >
      {Array.from({ length: count }).map((_, i) => {
        const targetX = spacing * (i + 1);
        return (
          <motion.line
            key={i}
            x1={hubX}
            y1={hubY}
            x2={targetX}
            y2={cardY}
            stroke="#4FD1C5"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "easeOut" }}
          />
        );
      })}
      <motion.circle
        cx={hubX}
        cy={hubY}
        r="6"
        fill="#F2A93B"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  );
}