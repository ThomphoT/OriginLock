import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@/assets/originlock-logo.jpeg";

interface SplashScreenProps {
  children: React.ReactNode;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ children }) => {
  const [phase, setPhase] = useState<"rotate" | "glow" | "exit" | "done">("rotate");

  useEffect(() => {
    // Phase 1: Logo enters and rotates (0 -> 2.2s)
    const glowTimer = setTimeout(() => setPhase("glow"), 2200);
    // Phase 2: Glow holds (2.2s -> 3.6s)
    const exitTimer = setTimeout(() => setPhase("exit"), 3600);
    // Phase 3: Fade out (3.6s -> 4.4s)
    const doneTimer = setTimeout(() => setPhase("done"), 4400);

    return () => {
      clearTimeout(glowTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return <>{children}</>;

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: "#030712" }}
          >
            {/* Ambient background glow */}
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase === "glow" || phase === "exit" ? 0.6 : 0,
                scale: phase === "glow" || phase === "exit" ? 1.2 : 0.5,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                width: 400,
                height: 400,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, hsla(271,81%,56%,0.15) 0%, hsla(195,100%,50%,0.08) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* Logo container with Y-axis rotation (horizontal spin) */}
            <motion.div
              className="relative"
              style={{ perspective: 1200 }}
            >
              <motion.div
                initial={{ rotateY: 0, opacity: 0, scale: 0.8 }}
                animate={{
                  rotateY: phase === "rotate" || phase === "glow" ? 360 : 360,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  rotateY: { duration: 2, ease: [0.25, 0.1, 0.25, 1] },
                  opacity: { duration: 0.5, ease: "easeOut" },
                  scale: { duration: 0.6, ease: "easeOut" },
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Glow ring behind logo */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: phase === "glow" || phase === "exit" ? 1 : 0,
                    scale: phase === "glow" ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    boxShadow:
                      "0 0 60px 20px hsla(271,81%,56%,0.25), 0 0 120px 40px hsla(195,100%,50%,0.12), 0 0 180px 60px hsla(271,81%,56%,0.06)",
                    borderRadius: "50%",
                    inset: -20,
                  }}
                />

                {/* The actual logo */}
                <img
                  src={logoImage}
                  alt="OriginLock"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover relative z-10"
                  draggable={false}
                  style={{
                    filter:
                      phase === "glow"
                        ? "drop-shadow(0 0 30px hsla(271,81%,56%,0.4)) drop-shadow(0 0 60px hsla(195,100%,50%,0.2))"
                        : "none",
                    transition: "filter 0.8s ease",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Brand text beneath logo */}
            <motion.div
              className="absolute flex flex-col items-center"
              style={{ bottom: "30%" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: phase === "glow" || phase === "exit" ? 1 : 0,
                y: phase === "glow" ? 0 : 15,
              }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <p
                className="text-[11px] tracking-[0.25em] uppercase font-medium"
                style={{ color: "hsl(215 20% 55%)" }}
              >
                Own Your Ideas. Protect Your Future.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children behind splash during exit for smooth transition */}
      {phase === "exit" && children}
      {phase === "done" && children}
    </>
  );
};

export default SplashScreen;