import { motion } from "framer-motion";

export function DentalLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0b0b0b]"
    >
      {/* Halo clínico */}
      <motion.div
        className="absolute h-56 w-56 rounded-full bg-cyan-300/40 blur-3xl dark:bg-cyan-900/40"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Escáner circular */}
      <motion.div
        className="absolute h-48 w-48 rounded-full border-[3px] border-cyan-400/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Diente */}
      <motion.img
        src="/images/tooth.png"
        alt="Dental loader"
        className="relative w-24"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />

      {/* Brillo */}
      <motion.div
        className="absolute h-40 w-1 bg-white/40 blur-md"
        animate={{ x: [-80, 80], opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </motion.div>
  );
}
