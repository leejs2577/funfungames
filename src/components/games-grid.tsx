"use client";

import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gameCatalog } from "@/lib/game-data";
import { openGame } from "@/lib/open-game";

export function GamesGrid() {
  return (
    <>
      {/* Featured section */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="fun-panel bg-[var(--arcade-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]">
          <CardContent className="flex h-full flex-col justify-between gap-5 p-7">
            <div className="space-y-4">
              <Badge className="rounded-full border border-[var(--neon-yellow)]/40 bg-[var(--neon-yellow)]/10 text-[var(--neon-yellow)] hover:bg-[var(--neon-yellow)]/10">
                Editor&apos;s favorite
              </Badge>
              <div className="space-y-2">
                <p className="text-5xl">🧩</p>
                <h2
                  className="text-2xl font-bold text-[var(--neon-cyan)]"
                  style={{ textShadow: "0 0 15px rgba(0,229,255,0.4)" }}
                >
                  Tetris
                </h2>
                <p className="max-w-xl text-sm leading-7 text-slate-400">
                  클래식 퍼즐 감각을 유지하면서도, 카드형 UI와 가벼운 플레이 구조에 맞게
                  재구성한 핵심 대표 게임입니다.
                </p>
              </div>
            </div>
            <Button
              onClick={() => openGame("tetris")}
              className="w-fit rounded-full bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
            >
              테트리스 시작하기
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {gameCatalog.slice(1, 3).map((game) => (
            <Card
              key={game.slug}
              className="fun-panel cursor-pointer bg-[var(--arcade-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,0,170,0.15)]"
              onClick={() => openGame(game.slug)}
            >
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-3xl">{game.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{game.title}</h3>
                    <p className="text-sm text-slate-500">{game.category}</p>
                  </div>
                </div>
                <p className="mb-5 text-sm leading-7 text-slate-400">{game.description}</p>
                <Button
                  variant="secondary"
                  className="rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGame(game.slug);
                  }}
                >
                  플레이
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* All games grid */}
      <section className="grid gap-4 md:grid-cols-2">
        {gameCatalog.map((game) => (
          <Card
            key={game.slug}
            className="fun-panel cursor-pointer bg-[var(--arcade-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]"
            onClick={() => openGame(game.slug)}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--neon-cyan)]/30 bg-gradient-to-br from-[#0a0a2a] to-[#1a0a3a] text-2xl shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                    {game.emoji}
                  </div>
                  <div>
                    <CardTitle className="text-slate-100">{game.title}</CardTitle>
                    <CardDescription className="text-slate-500">{game.tagline}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                >
                  {game.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-slate-400">{game.description}</p>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-[var(--neon-magenta)]/25 text-slate-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                className="rounded-full bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:scale-[1.02]"
                onClick={(e) => {
                  e.stopPropagation();
                  openGame(game.slug);
                }}
              >
                {game.title} 플레이
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
