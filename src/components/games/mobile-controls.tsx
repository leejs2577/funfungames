"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export type Direction = "up" | "down" | "left" | "right";

interface MobileControlsProps {
  onDirection: (dir: Direction) => void;
  onAction?: () => void;
  actionLabel?: string;
  disabled?: boolean;
}

interface DPadButtonProps {
  dir: Direction;
  onDirection: (dir: Direction) => void;
  disabled?: boolean;
}

function DPadButton({ dir, onDirection, disabled }: DPadButtonProps) {
  const icons = {
    up: ChevronUp,
    down: ChevronDown,
    left: ChevronLeft,
    right: ChevronRight,
  };
  const Icon = icons[dir];

  return (
    <button
      className="flex size-14 items-center justify-center rounded-lg text-[var(--neon-cyan)] transition-transform active:scale-90 active:bg-[var(--neon-cyan)]/20 disabled:opacity-30"
      style={{
        border: "1px solid rgba(0, 229, 255, 0.35)",
        backgroundColor: "rgba(13, 13, 38, 0.9)",
        boxShadow: "0 0 8px rgba(0,229,255,0.1)",
        touchAction: "manipulation",
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        if (!disabled) onDirection(dir);
      }}
      disabled={disabled}
      aria-label={dir}
    >
      <Icon className="size-6" />
    </button>
  );
}

export function MobileControls({
  onDirection,
  onAction,
  actionLabel = "ACT",
  disabled,
}: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768 || navigator.maxTouchPoints > 0);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Swipe gesture detection on the entire document
  useEffect(() => {
    if (!isMobile) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (disabled) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const threshold = 30;

      if (Math.max(absDx, absDy) < threshold) return;

      if (absDx > absDy) {
        onDirection(dx > 0 ? "right" : "left");
      } else {
        onDirection(dy > 0 ? "down" : "up");
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, disabled, onDirection]);

  if (!isMobile) return null;

  return (
    <div
      className="mt-4 flex flex-col items-center gap-3 select-none"
      style={{ touchAction: "none" }}
    >
      {/* D-pad */}
      <div className="grid grid-cols-3 gap-1.5">
        <div />
        <DPadButton dir="up" onDirection={onDirection} disabled={disabled} />
        <div />
        <DPadButton dir="left" onDirection={onDirection} disabled={disabled} />
        <div
          className="size-14 rounded-lg"
          style={{
            border: "1px solid rgba(0, 229, 255, 0.1)",
            backgroundColor: "rgba(13, 13, 38, 0.5)",
          }}
        />
        <DPadButton dir="right" onDirection={onDirection} disabled={disabled} />
        <div />
        <DPadButton dir="down" onDirection={onDirection} disabled={disabled} />
        <div />
      </div>

      {/* Optional action button */}
      {onAction && (
        <button
          className="mt-1 rounded-lg px-8 py-3 text-xs font-bold uppercase tracking-widest text-[var(--neon-yellow)] transition-all active:scale-95 active:bg-[var(--neon-yellow)]/20 disabled:opacity-30"
          style={{
            border: "1px solid rgba(255, 230, 0, 0.5)",
            backgroundColor: "rgba(255, 230, 0, 0.05)",
            boxShadow: "0 0 10px rgba(255,230,0,0.15)",
            touchAction: "manipulation",
            fontFamily: "var(--font-arcade)",
            fontSize: "10px",
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            if (!disabled) onAction();
          }}
          disabled={disabled}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
