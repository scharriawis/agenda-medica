import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function LoadingScreen() {

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio("/sounds/beep.wav");
        audioRef.current.volume = 0.5;

        // Monitor cardíaco lento (≈60–70 bpm)
        const interval = setInterval(() => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }, 1200); // Lento y profesional

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0b0b0b]"
        >

            {/* HALO DE VIDA */}
            <motion.div
                className="absolute h-60 w-60 rounded-full bg-green-300 opacity-40 blur-3xl dark:bg-green-900"
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 3.2, repeat: Infinity }}
            />

            {/* LOGO CON LATIDO LENTO */}
            <motion.img
                src="/images/logoHospital.png"
                className="relative w-44"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
            />

            {/* ECG PROFESIONAL – ANIMADO & CENTRADO */}
            <div className="mt-8 flex justify-center w-full">
                <motion.svg
                    width="320"
                    height="70"
                    viewBox="0 0 320 70"
                >
                    <motion.path
                        d="
                            M0 35
                            L40 35
                            L70 35
                            L90 10
                            L110 60
                            L130 35
                            L170 35
                            L195 25
                            L215 50
                            L235 35
                            L260 35
                            L285 20
                            L310 60
                            L320 35
                        "
                        fill="none"
                        stroke="#ff1a1a"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{
                            pathLength: [0, 1, 1],
                            opacity: [0.3, 1, 0.3],
                            x: ["0%", "-12%", "-25%"], // desplazamiento real monitor
                        }}
                        transition={{
                            duration: 2.4, // pulso lento
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.svg>
            </div>

        </motion.div>
    );
}
