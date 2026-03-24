import { Suspense } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { GamesGrid } from "@/components/games-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GamesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="fun-panel rounded-[1.5rem] p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="rounded-full border border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/10">
                <Sparkles className="mr-1 size-3" />
                All games
              </Badge>
              <h1
                className="text-3xl font-black tracking-tight text-[var(--neon-cyan)]"
                style={{ textShadow: "0 0 15px rgba(0,229,255,0.35)" }}
              >
                Pick a game and jump in
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                FunFUnGames의 전체 게임을 카드, 배지, 미니멀 설명 구조로 정리했습니다.
                가벼운 플레이와 빠른 진입에 초점을 맞췄습니다.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
            >
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
