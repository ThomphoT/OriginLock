import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const trailSpringConfig = { damping: 20, stiffness: 150, mass: 0.8 };

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothTrailX = useSpring(trailX, trailSpringConfig);
  const smoothTrailY = useSpring(trailY, trailSpringConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hoverable elements
    const handleElementHover = () => {
      const checkHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isClickable =
          target.closest("a, button, [role='button'], input, textarea, select, [data-clickable]") !== null ||
          window.getComputedStyle(target).cursor === "pointer";
        setIsHovering(isClickable);
      };
      document.addEventListener("mouseover", checkHover);
      return () => document.removeEventListener("mouseover", checkHover);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    const cleanupHover = handleElementHover();

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cleanupHover();
      document.documentElement.style.cursor = "";
      const s = document.getElementById("custom-cursor-style");
      if (s) s.remove();
    };
  }, [isTouchDevice, isVisible]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {/* Trail / outer ring */}
      <motion.div
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          opacity: isVisible ? (isClicking ? 0.6 : 0.35) : 0,
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
          translateX: "-50%",
          translateY: "-50%",
          border: `1.5px solid ${isHovering ? "hsla(271,81%,56%,0.5)" : "hsla(215,20%,65%,0.3)"}`,
          background: isHovering
            ? "radial-gradient(circle, hsla(271,81%,56%,0.08) 0%, transparent 70%)"
            : "transparent",
          transition: "border-color 0.3s ease, background 0.3s ease",
        }}
      />

      {/* Dot / inner cursor */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isClicking ? 4 : isHovering ? 6 : 5,
          height: isClicking ? 4 : isHovering ? 6 : 5,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          background: isHovering
            ? "hsl(271, 81%, 56%)"
            : "hsl(213, 31%, 97%)",
          boxShadow: isHovering
            ? "0 0 12px hsla(271,81%,56%,0.5), 0 0 24px hsla(195,100%,50%,0.2)"
            : "0 0 6px hsla(213,31%,97%,0.3)",
          transition: "background 0.2s ease, box-shadow 0.2s ease",
        }}
      />
    </div>
  );
};

export default CustomCursor;