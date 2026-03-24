import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";

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
import { PlayButton } from "@/components/play-button";

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
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="fun-panel bg-[var(--arcade-card)]">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-4">
                <div className="text-6xl">{game.emoji}</div>
                <div>
                  <h1
                    className="text-3xl font-black tracking-tight text-[var(--neon-cyan)]"
                    style={{ textShadow: "0 0 15px rgba(0,229,255,0.35)" }}
                  >
                    {game.title}
                  </h1>
                  <p className="mt-2 text-base text-slate-400">{game.tagline}</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-300">{game.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border border-[var(--neon-cyan)]/35 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10">
                  {game.category}
                </Badge>
                <Badge className="rounded-full border border-[var(--neon-magenta)]/35 bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/10">
                  {game.difficulty}
                </Badge>
                {game.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-slate-600 text-slate-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <PlayButton slug={slug} label={`${game.title} 플레이`} />
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
                >
                  <Link href="/games">다른 게임 보기</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-600 text-slate-400 hover:text-slate-200"
                >
                  <Link href="/">홈으로</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="fun-panel bg-[var(--arcade-card)]">
            <CardHeader>
              <CardTitle className="text-slate-100">How to play</CardTitle>
              <CardDescription className="leading-7 text-slate-400">{game.instructions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {game.hints.map((hint) => (
                  <div
                    key={hint}
                    className="rounded-xl border border-[var(--neon-cyan)]/15 bg-[var(--arcade-bg)]/60 p-4 text-sm leading-7 text-slate-400"
                  >
                    {hint}
                  </div>
                ))}
              </div>

              {/* Large play CTA */}
              <div className="mt-6 flex items-center justify-center rounded-2xl border border-[var(--neon-magenta)]/20 bg-gradient-to-br from-[var(--neon-magenta)]/5 to-[var(--arcade-bg)] p-8">
                <div className="text-center space-y-4">
                  <div className="text-5xl">{game.emoji}</div>
                  <p className="text-sm text-slate-500">새 창에서 최적화된 화면으로 플레이하세요</p>
                  <PlayButton
                    slug={slug}
                    label="새 창으로 플레이"
                    icon
                    className="bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
