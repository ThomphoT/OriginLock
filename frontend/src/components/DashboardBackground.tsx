import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ============================================
   Pure Canvas Particle System
   ============================================ */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      offset: number;
    }[] = [];

    const PARTICLE_COUNT = 50;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.25,
        hue: Math.random() > 0.5 ? 271 : 195,
        offset: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    window.addEventListener("resize", handleResize);

    let time = 0;
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Gentle floating motion
        p.x += p.vx + Math.sin(time * 2 + p.offset) * 0.15;
        p.y += p.vy + Math.cos(time * 1.5 + p.offset) * 0.1;

        // Wrap around screen
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Pulsing opacity
        const pulse = 0.5 + Math.sin(time * 3 + p.offset) * 0.5;
        const alpha = p.opacity * (0.6 + pulse * 0.4);

        // Draw glow
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 4
        );
        const colorStr = p.hue === 271
          ? `hsla(271, 81%, 56%, ${alpha})`
          : `hsla(195, 100%, 50%, ${alpha})`;
        gradient.addColorStop(0, colorStr);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = colorStr;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ============================================
   CSS Holographic Lock with Y-axis rotation
   ============================================ */
function HolographicLock() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{
          repeat: Infinity,
          duration: 24,
          ease: "linear",
        }}
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Lock SVG shape */}
        <svg
          width="280"
          height="340"
          viewBox="0 0 280 340"
          fill="none"
          className="opacity-[0.06]"
          style={{
            filter:
              "drop-shadow(0 0 40px hsla(271,81%,56%,0.3)) drop-shadow(0 0 80px hsla(195,100%,50%,0.15))",
          }}
        >
          {/* Shackle */}
          <path
            d="M80 140 C80 60, 200 60, 200 140"
            stroke="url(#lockGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lock body */}
          <rect
            x="50"
            y="140"
            width="180"
            height="150"
            rx="20"
            stroke="url(#lockGradient)"
            strokeWidth="3"
            fill="url(#lockFill)"
          />
          {/* Keyhole outer */}
          <circle
            cx="140"
            cy="205"
            r="22"
            stroke="url(#lockGradient)"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Keyhole slot */}
          <rect
            x="134"
            y="218"
            width="12"
            height="30"
            rx="4"
            fill="url(#lockGradient)"
            opacity="0.5"
          />
          {/* Inner frame */}
          <rect
            x="65"
            y="155"
            width="150"
            height="120"
            rx="12"
            stroke="url(#lockGradientCyan)"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />

          <defs>
            <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(271, 81%, 56%)" />
              <stop offset="100%" stopColor="hsl(195, 100%, 50%)" />
            </linearGradient>
            <linearGradient id="lockGradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(195, 100%, 50%)" />
              <stop offset="100%" stopColor="hsl(271, 81%, 56%)" />
            </linearGradient>
            <radialGradient id="lockFill" cx="50%" cy="50%">
              <stop offset="0%" stopColor="hsl(271, 81%, 56%)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="hsl(195, 100%, 50%)" stopOpacity="0.01" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

/* ============================================
   Ambient glow orbs
   ============================================ */
function AmbientGlow() {
  return (
    <>
      <motion.div
        className="absolute rounded-full"
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -20, 15, -10, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
        style={{
          width: 350,
          height: 350,
          top: "15%",
          left: "20%",
          background:
            "radial-gradient(circle, hsla(271,81%,56%,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        animate={{
          x: [0, -25, 15, -10, 0],
          y: [0, 15, -25, 10, 0],
          scale: [1, 0.95, 1.1, 1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          width: 300,
          height: 300,
          bottom: "10%",
          right: "15%",
          background:
            "radial-gradient(circle, hsla(195,100%,50%,0.035) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </>
  );
}

/* ============================================
   Main Background Composite
   ============================================ */
const DashboardBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <AmbientGlow />
      <HolographicLock />
      <ParticleCanvas />
    </div>
  );
};

export default DashboardBackground;