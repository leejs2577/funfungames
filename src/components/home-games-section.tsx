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

export function HomeGamesSection() {
  const featuredGames = gameCatalog.slice(0, 2);

  return (
    <>
      {/* Featured games */}
      <section className="mt-16 grid gap-4 lg:grid-cols-2">
        {featuredGames.map((game) => (
          <Card
            key={game.slug}
            className="fun-panel cursor-pointer bg-[var(--arcade-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]"
            onClick={() => openGame(game.slug)}
          >
            <CardContent className="p-8">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-5xl">{game.emoji}</div>
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                  >
                    {game.difficulty}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-100">{game.title}</h3>
                  <p className="text-sm leading-7 text-slate-400">{game.description}</p>
                </div>
                <Button
                  className="rounded-full bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGame(game.slug);
                  }}
                >
                  {game.title} 플레이
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* All games grid */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {gameCatalog.map((game) => (
          <Card
            key={game.slug}
            className="fun-panel cursor-pointer bg-[var(--arcade-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,0,170,0.12)]"
            onClick={() => openGame(game.slug)}
          >
            <CardHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{game.emoji}</span>
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-[var(--neon-magenta)]/30 bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)] text-xs"
                  >
                    {game.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base text-slate-100">{game.title}</CardTitle>
                <CardDescription className="text-xs text-slate-500">{game.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                className="w-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] text-black font-bold text-xs hover:scale-[1.02]"
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
      </section>
    </>
  );
}
