import React from "react";
import { motion } from "framer-motion";
import logoImage from "@/assets/originlock-logo.jpeg";

interface RotatingLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

const RotatingLogo: React.FC<RotatingLogoProps> = ({ size = 80, className = "", glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: size * 1.5,
            height: size * 1.5,
            background: "radial-gradient(circle, hsl(271 81% 56% / 0.2) 0%, hsl(195 100% 50% / 0.1) 50%, transparent 70%)",
          }}
        />
      )}
      <motion.img
        src={logoImage}
        alt="OriginLock"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "linear",
        }}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        draggable={false}
      />
    </div>
  );
};

export default RotatingLogo;