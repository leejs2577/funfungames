import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

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
import { gameCatalog } from "@/lib/game-data";

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_rgba(255,251,235,0.8),_rgba(255,255,255,1)_25%,_rgba(239,246,255,0.75)_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="fun-panel rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100">
                <Sparkles className="mr-1 size-3" />
                All games
              </Badge>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Pick a game and jump in
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                FunFUnGames의 전체 게임을 카드, 배지, 미니멀 설명 구조로 정리했습니다.
                가벼운 플레이와 빠른 진입에 초점을 맞췄습니다.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full bg-white">
              <Link href="/">랜딩으로 돌아가기</Link>
            </Button>
          </div>
        </section>

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
              <Button asChild className="w-fit rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 text-white shadow-[0_16px_32px_rgba(251,146,60,0.2)] hover:scale-[1.03]">
                <Link href="/games/tetris">테트리스 시작하기</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {gameCatalog.slice(1, 3).map((game) => (
              <Card key={game.slug} className={`fun-panel border-white/70 bg-gradient-to-br ${game.tint} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(168,85,247,0.18)]`}>
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-3xl">{game.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{game.title}</h3>
                      <p className="text-sm text-slate-600">{game.category}</p>
                    </div>
                  </div>
                  <p className="mb-5 text-sm leading-7 text-slate-700">{game.description}</p>
                  <Button asChild variant="secondary" className="rounded-full bg-white text-slate-900">
                    <Link href={`/games/${game.slug}`}>플레이</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {gameCatalog.map((game) => (
              <Card key={game.slug} className="border-white/70 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:rotate-[0.3deg] hover:shadow-[0_20px_40px_rgba(59,130,246,0.14)]">
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
                <Button asChild className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] hover:scale-[1.02]">
                  <Link href={`/games/${game.slug}`}>
                    {game.title} 플레이
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
