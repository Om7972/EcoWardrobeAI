import React, { useState, useEffect } from "react";
import "../../styles/custom-cursor.css";

interface CustomCursorProps {
  color?: string;
  size?: number;
  ringSize?: number;
  delay?: number;
  exclusionClass?: string;
}

export function CustomCursor({
  color = "rgba(var(--primary), 0.5)",
  size = 8,
  ringSize = 40,
  delay = 0.1,
  exclusionClass = "cursor-default",
}: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over an interactive element
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const isExcluded = target.closest(`.${exclusionClass}`);
      
      setIsPointer(
        computedStyle.cursor === "pointer" && !isExcluded
      );
      
      if (!visible) setVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [exclusionClass, visible]);

  // Apply cursor styles to the body
  useEffect(() => {
    // Only apply custom cursor on desktop devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      document.body.style.cursor = "none";
    }
    
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Dot cursor */}
      <div
        className={`cursor-dot ${isClicking ? 'clicking' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color
        }}
      />
      
      {/* Ring cursor */}
      <div
        className={`cursor-ring ${isClicking ? 'clicking' : ''} ${isPointer ? 'pointer' : ''}`}
        style={{
          left: `${position.x - (isPointer ? ringSize * 0.75 : ringSize / 2)}px`,
          top: `${position.y - (isPointer ? ringSize * 0.75 : ringSize / 2)}px`,
          width: `${isPointer ? ringSize * 1.5 : ringSize}px`,
          height: `${isPointer ? ringSize * 1.5 : ringSize}px`,
          border: `2px solid ${color}`
        }}
      />
    </>
  );
}