"use client";

import { useParams } from "next/navigation";
import { X } from "lucide-react";

import { TetrisGame } from "@/components/games/game-tetris";
import { Game2048 } from "@/components/games/game-2048";
import { SnakeGame } from "@/components/games/game-snake";
import { MemoryMatchGame } from "@/components/games/game-memory-match";
import { ChessGame } from "@/components/games/game-chess";
import { getGameBySlug } from "@/lib/game-data";

const GAME_COMPONENTS: Record<string, React.ComponentType<{ inModal?: boolean }>> = {
  tetris: TetrisGame,
  "2048": Game2048,
  snake: SnakeGame,
  "memory-match": MemoryMatchGame,
  chess: ChessGame,
};

export default function PlayPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const game = getGameBySlug(slug);
  const GameComponent = GAME_COMPONENTS[slug];

  if (!game || !GameComponent) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--arcade-bg)]">
        <p className="text-lg text-slate-500">게임을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ backgroundColor: "var(--arcade-bg)" }}
    >
      {/* Sticky slim header */}
      <header
        className="shrink-0 flex items-center justify-between border-b px-4 py-2.5 backdrop-blur-md sm:px-6"
        style={{
          borderColor: "rgba(0, 229, 255, 0.2)",
          backgroundColor: "rgba(10, 10, 26, 0.9)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{game.emoji}</span>
          <div>
            <h1 className="text-sm font-bold text-slate-100">{game.title}</h1>
            <p className="text-xs text-slate-500">{game.tagline}</p>
          </div>
        </div>
        <button
          onClick={() => window.close()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-[var(--neon-magenta)]"
          style={{ backgroundColor: "rgba(255,0,170,0.05)" }}
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Game area fills remaining viewport height, no window-level scroll */}
      <main className="min-h-0 flex-1 overflow-auto px-4 py-3 sm:px-6">
        <GameComponent inModal />
      </main>
    </div>
  );
}
