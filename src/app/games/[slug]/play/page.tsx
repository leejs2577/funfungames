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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-500">게임을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{game.emoji}</span>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{game.title}</h1>
            <p className="text-xs text-slate-500">{game.tagline}</p>
          </div>
        </div>
        <button
          onClick={() => window.close()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-rose-100 hover:text-rose-600"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <GameComponent inModal />
      </main>
    </div>
  );
}
