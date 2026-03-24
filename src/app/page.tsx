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
  },
  {
    title: "Grid layout",
    description: "모든 게임을 한눈에 보기 쉬운 미니멀 카드 그리드로 정리합니다.",
    icon: Grid2x2,
  },
  {
    title: "Compact layout",
    description: "짧은 설명과 빠른 진입 버튼 중심의 가벼운 리스트 레이아웃입니다.",
    icon: LayoutGrid,
  },
];

export default function Home() {

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,220,228,0.9),_rgba(255,255,255,1)_38%,_rgba(245,248,255,1)_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="sparkle-dot left-10 top-6 size-8 bg-amber-300/70 animate-float" />
            <div className="sparkle-dot right-24 top-12 size-5 bg-sky-300/80 animate-float-slow" />
            <div className="sparkle-dot bottom-10 left-1/2 size-6 bg-fuchsia-300/70 animate-float" />
          </div>
          <Card className="fun-panel overflow-hidden border-white/70 bg-white/85 shadow-[0_20px_70px_rgba(255,184,196,0.25)] backdrop-blur transition-transform duration-300 hover:-translate-y-1">
            <CardContent className="flex flex-col gap-8 p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full bg-rose-100 px-3 py-1 text-rose-700 hover:bg-rose-100 animate-pulse-glow">
                  Bright & playful
                </Badge>
                <Badge className="rounded-full bg-sky-100 px-3 py-1 text-sky-700 hover:bg-sky-100">
                  Minimal game portal
                </Badge>
                <Badge className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-100 animate-wiggle-soft">
                  ✨ Fun mode
                </Badge>
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  FunFUnGames
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  밝고 캐주얼한 무드에 미니멀한 구조를 더한 작은 웹 아케이드입니다.
                  랜딩페이지에서 원하는 레이아웃으로 게임을 고르고 바로 플레이할 수
                  있게 설계했습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 px-6 text-white shadow-[0_18px_35px_rgba(217,70,239,0.25)] hover:scale-[1.03]">
                  <Link href="/games">
                    게임 보러가기
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white/70 px-6"
                >
                  <Link href="/games/tetris">대표 게임 바로 시작</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-white p-4 shadow-sm transition-transform hover:-translate-y-1">
                  <p className="text-sm text-slate-500">Games</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">4</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm transition-transform hover:-translate-y-1">
                  <p className="text-sm text-slate-500">Layouts</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm transition-transform hover:-translate-y-1">
                  <p className="text-sm text-slate-500">Ready</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">Local</p>
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
            <Card key={item.title} className="border-white/70 bg-white/75 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(14,165,233,0.15)]">
              <CardHeader>
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-violet-500 text-white shadow-lg">
                  <item.icon className="size-5" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-7 text-slate-600">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>


        <section className="fun-panel rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-sky-500">Designed for quick play</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                가볍게 시작하고, 오래 머물기 좋은 포털
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                각 게임은 별도 페이지로 분리되어 있고, 랜딩페이지와 목록페이지에서는 서로
                다른 카드 레이아웃으로 자연스럽게 탐색할 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-slate-900">
                  <Gamepad2 className="size-4" />
                  <span className="font-semibold">Instant play</span>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  클릭 한 번으로 바로 게임 화면으로 이동합니다.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-slate-900">
                  <LayoutGrid className="size-4" />
                  <span className="font-semibold">Flexible layout</span>
                </div>
                <p className="text-sm leading-6 text-slate-600">
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
