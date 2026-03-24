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

function openGame(slug: string) {
  window.open(
    `/games/${slug}/play`,
    `game-${slug}`,
    "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no"
  );
}

export function GamesGrid() {
  return (
    <>
      {/* Featured section */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="fun-panel border-white/70 bg-gradient-to-br from-rose-100 via-orange-50 to-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(251,146,60,0.18)]">
          <CardContent className="flex h-full flex-col justify-between gap-5 p-7">
            <div className="space-y-4">
              <Badge className="rounded-full bg-white/90 text-slate-700 hover:bg-white/90">
                Editor&apos;s favorite
              </Badge>
              <div className="space-y-2">
                <p className="text-5xl">🧩</p>
                <h2 className="text-3xl font-bold text-slate-900">Tetris</h2>
                <p className="max-w-xl text-sm leading-7 text-slate-700">
                  클래식 퍼즐 감각을 유지하면서도, 카드형 UI와 가벼운 플레이 구조에 맞게
                  재구성한 핵심 대표 게임입니다.
                </p>
              </div>
            </div>
            <Button
              onClick={() => openGame("tetris")}
              className="w-fit rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white shadow-[0_16px_32px_rgba(251,146,60,0.2)] hover:scale-[1.03]"
            >
              테트리스 시작하기
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {gameCatalog.slice(1, 3).map((game) => (
            <Card
              key={game.slug}
              className={`fun-panel border-white/70 bg-gradient-to-br ${game.tint} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(168,85,247,0.18)] cursor-pointer`}
              onClick={() => openGame(game.slug)}
            >
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-3xl">{game.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{game.title}</h3>
                    <p className="text-sm text-slate-600">{game.category}</p>
                  </div>
                </div>
                <p className="mb-5 text-sm leading-7 text-slate-700">{game.description}</p>
                <Button
                  variant="secondary"
                  className="rounded-full bg-white text-slate-900"
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
            className="border-white/70 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-[0.3deg] hover:shadow-[0_20px_40px_rgba(59,130,246,0.14)] cursor-pointer"
            onClick={() => openGame(game.slug)}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-violet-500 to-fuchsia-500 text-2xl text-white shadow-lg">
                    {game.emoji}
                  </div>
                  <div>
                    <CardTitle>{game.title}</CardTitle>
                    <CardDescription>{game.tagline}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {game.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-7 text-slate-600">{game.description}</p>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] hover:scale-[1.02]"
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
