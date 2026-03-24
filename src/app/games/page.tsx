import { Suspense } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { GamesGrid } from "@/components/games-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

        <Suspense fallback={null}>
          <GamesGrid />
        </Suspense>
      </main>
    </div>
  );
}
