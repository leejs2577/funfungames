import Link from "next/link";
import { notFound } from "next/navigation";

import { Game2048 } from "@/components/games/game-2048";
import { MemoryMatchGame } from "@/components/games/game-memory-match";
import { SnakeGame } from "@/components/games/game-snake";
import { TetrisGame } from "@/components/games/game-tetris";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { gameCatalog, getGameBySlug } from "@/lib/game-data";

export function generateStaticParams() {
  return gameCatalog.map((game) => ({ slug: game.slug }));
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_rgba(254,242,242,0.7),_rgba(255,255,255,1)_28%,_rgba(240,249,255,0.9)_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className={`border-white/70 bg-gradient-to-br ${game.tint} shadow-sm`}>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-4">
                <div className="text-6xl">{game.emoji}</div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    {game.title}
                  </h1>
                  <p className="mt-2 text-base text-slate-600">{game.tagline}</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-700">{game.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-white/90 text-slate-700 hover:bg-white/90">
                  {game.category}
                </Badge>
                <Badge className="rounded-full bg-white/90 text-slate-700 hover:bg-white/90">
                  {game.difficulty}
                </Badge>
                {game.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-white/80 bg-white/50 text-slate-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-slate-900">
                  <Link href="/games">다른 게임 보기</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full bg-white/70">
                  <Link href="/">홈으로</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle>How to play</CardTitle>
              <CardDescription className="leading-7">{game.instructions}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {game.hints.map((hint) => (
                <div key={hint} className="rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  {hint}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          {slug === "tetris" ? <TetrisGame /> : null}
          {slug === "2048" ? <Game2048 /> : null}
          {slug === "snake" ? <SnakeGame /> : null}
          {slug === "memory-match" ? <MemoryMatchGame /> : null}
        </section>
      </main>
    </div>
  );
}
