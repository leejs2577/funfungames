import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Grid2x2,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { HomeGamesSection } from "@/components/home-games-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "Featured layout",
    description: "큰 카드형 추천 게임 섹션으로 첫 진입 시 시선을 잡아줍니다.",
    icon: Sparkles,
    color: "var(--neon-cyan)",
  },
  {
    title: "Grid layout",
    description: "모든 게임을 한눈에 보기 쉬운 미니멀 카드 그리드로 정리합니다.",
    icon: Grid2x2,
    color: "var(--neon-magenta)",
  },
  {
    title: "Compact layout",
    description: "짧은 설명과 빠른 진입 버튼 중심의 가벼운 리스트 레이아웃입니다.",
    icon: LayoutGrid,
    color: "var(--neon-yellow)",
  },
];

export default function Home() {

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="sparkle-dot left-10 top-6 size-8 bg-[var(--neon-cyan)]/40 animate-float" />
            <div className="sparkle-dot right-24 top-12 size-5 bg-[var(--neon-magenta)]/50 animate-float-slow" />
            <div className="sparkle-dot bottom-10 left-1/2 size-6 bg-[var(--neon-yellow)]/40 animate-float" />
          </div>
          <Card className="fun-panel overflow-hidden bg-[var(--arcade-card)] backdrop-blur transition-transform duration-300 hover:-translate-y-1">
            <CardContent className="flex flex-col gap-8 p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 px-3 py-1 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 animate-pulse-glow">
                  Retro &amp; Playful
                </Badge>
                <Badge className="rounded-full border border-[var(--neon-magenta)]/40 bg-[var(--neon-magenta)]/10 px-3 py-1 text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/10">
                  Arcade Portal
                </Badge>
                <Badge className="rounded-full border border-[var(--neon-yellow)]/40 bg-[var(--neon-yellow)]/10 px-3 py-1 text-[var(--neon-yellow)] hover:bg-[var(--neon-yellow)]/10 animate-wiggle-soft">
                  ✨ Fun mode
                </Badge>
              </div>
              <div className="space-y-4">
                <h1
                  className="max-w-3xl text-3xl font-black tracking-tight text-[var(--neon-cyan)] sm:text-4xl lg:text-5xl"
                  style={{
                    fontFamily: "var(--font-arcade)",
                    textShadow: "0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.15)",
                    lineHeight: "1.4",
                  }}
                >
                  FunFUnGames
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                  레트로 아케이드 감성으로 즐기는 미니게임 포털입니다.
                  원하는 게임을 고르고 바로 플레이하세요.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] px-6 text-black font-bold shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(0,229,255,0.5)]"
                >
                  <Link href="/games">
                    게임 보러가기
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 px-6 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
                >
                  <Link href="/games/tetris">대표 게임 바로 시작</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5 p-4 transition-transform hover:-translate-y-1">
                  <p className="text-sm text-slate-500">Games</p>
                  <p className="mt-2 text-2xl font-bold text-[var(--neon-cyan)]">5</p>
                </div>
                <div className="rounded-xl border border-[var(--neon-magenta)]/20 bg-[var(--neon-magenta)]/5 p-4 transition-transform hover:-translate-y-1">
                  <p className="text-sm text-slate-500">Layouts</p>
                  <p className="mt-2 text-2xl font-bold text-[var(--neon-magenta)]">3</p>
                </div>
                <div className="rounded-xl border border-[var(--neon-yellow)]/20 bg-[var(--neon-yellow)]/5 p-4 transition-transform hover:-translate-y-1">
                  <p className="text-sm text-slate-500">Ready</p>
                  <p className="mt-2 text-2xl font-bold text-[var(--neon-yellow)]">Local</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Suspense fallback={null}>
            <HomeGamesSection />
          </Suspense>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {highlights.map((item) => (
            <Card
              key={item.title}
              className="fun-panel bg-[var(--arcade-card)] backdrop-blur transition-all duration-300 hover:-translate-y-1"
              style={{ "--item-color": item.color } as React.CSSProperties}
            >
              <CardHeader>
                <div
                  className="mb-4 flex size-11 items-center justify-center rounded-xl text-black shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}80)`,
                    boxShadow: `0 0 15px ${item.color}40`,
                  }}
                >
                  <item.icon className="size-5" />
                </div>
                <CardTitle className="text-xl text-slate-100">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-7 text-slate-400">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="fun-panel rounded-[1.5rem] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p
                className="text-sm font-medium text-[var(--neon-cyan)]"
                style={{ textShadow: "0 0 8px rgba(0,229,255,0.4)" }}
              >
                Designed for quick play
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-100">
                가볍게 시작하고, 오래 머물기 좋은 포털
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">
                각 게임은 별도 창으로 분리되어 있고, 랜딩페이지와 목록페이지에서는 서로
                다른 카드 레이아웃으로 자연스럽게 탐색할 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--neon-cyan)]/20 bg-[var(--arcade-bg)]/50 p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--neon-cyan)]">
                  <Gamepad2 className="size-4" />
                  <span className="font-semibold">Instant play</span>
                </div>
                <p className="text-sm leading-6 text-slate-400">
                  클릭 한 번으로 바로 게임 화면으로 이동합니다.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--neon-magenta)]/20 bg-[var(--arcade-bg)]/50 p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--neon-magenta)]">
                  <LayoutGrid className="size-4" />
                  <span className="font-semibold">Flexible layout</span>
                </div>
                <p className="text-sm leading-6 text-slate-400">
                  featured, grid, compact 섹션을 함께 보여줍니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
