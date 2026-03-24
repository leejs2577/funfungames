"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { TetrisGame } from "@/components/games/game-tetris";
import { Game2048 } from "@/components/games/game-2048";
import { SnakeGame } from "@/components/games/game-snake";
import { MemoryMatchGame } from "@/components/games/game-memory-match";

export function GameModal({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  // Scroll lock
  useEffect(() => {
    if (slug) {
      document.body.classList.add("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [slug]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!slug) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="relative bg-white rounded-2xl overflow-y-auto max-h-[95vh] w-full max-w-7xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md hover:bg-rose-50 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-900" />
        </button>

        {/* Game content */}
        <div className="p-6 sm:p-8 lg:p-10">
          {slug === "tetris" && <TetrisGame inModal />}
          {slug === "2048" && <Game2048 inModal />}
          {slug === "snake" && <SnakeGame inModal />}
          {slug === "memory-match" && <MemoryMatchGame inModal />}
        </div>
      </div>
    </div>
  );
}
