import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function MedicalLoader() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/beep.wav");
    audioRef.current.volume = 0.4;

    const interval = setInterval(() => {
      audioRef.current?.play().catch(() => {});
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.4, duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0b0b0b]"
    >
      {/* Halo vital */}
      <motion.div
        className="absolute h-64 w-64 rounded-full bg-green-400/30 blur-3xl dark:bg-green-900/40"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* Corazón */}
      <motion.img
        src="/images/heart.png"
        className="relative w-36"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      {/* ECG */}
      <motion.svg width="320" height="70" viewBox="0 0 320 70" className="mt-8">
        <motion.path
          d="
            M0 35 L60 35
            L85 10 L110 60 L135 35
            L180 35
            L205 25 L225 50 L245 35
            L320 35
          "
          fill="none"
          stroke="#dc2626"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{
            pathLength: [0, 1],
            opacity: [0.3, 1, 0.3],
            x: ["0%", "-20%"],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </motion.div>
  );
}
