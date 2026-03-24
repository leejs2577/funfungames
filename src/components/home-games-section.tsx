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

export function HomeGamesSection() {
  const featuredGames = gameCatalog.slice(0, 2);

  return (
    <>
      {/* Featured games */}
      <section className="mt-16 grid gap-4 lg:grid-cols-2">
        {featuredGames.map((game) => (
          <Card
            key={game.slug}
            className="fun-panel border-white/70 bg-gradient-to-br from-purple-50 via-pink-50 to-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(168,85,247,0.18)] cursor-pointer"
            onClick={() => openGame(game.slug)}
          >
            <CardContent className="p-8">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-5xl">{game.emoji}</div>
                  <Badge variant="secondary" className="rounded-full bg-white">
                    {game.difficulty}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900">{game.title}</h3>
                  <p className="text-sm leading-7 text-slate-700">{game.description}</p>
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
            className="border-white/70 bg-white/85 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.14)] cursor-pointer"
            onClick={() => openGame(game.slug)}
          >
            <CardHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{game.emoji}</span>
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {game.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base">{game.title}</CardTitle>
                <CardDescription className="text-xs">{game.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xs hover:scale-[1.02]"
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
