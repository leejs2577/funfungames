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
                <PlayButton slug={slug} label={`${game.title} 플레이`} />
                <Button asChild variant="outline" className="rounded-full bg-white/70">
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
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {game.hints.map((hint) => (
                  <div key={hint} className="rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                    {hint}
                  </div>
                ))}
              </div>

              {/* Large play CTA */}
              <div className="mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8">
                <div className="text-center space-y-4">
                  <div className="text-5xl">{game.emoji}</div>
                  <p className="text-sm text-slate-500">새 창에서 최적화된 화면으로 플레이하세요</p>
                  <PlayButton
                    slug={slug}
                    label="새 창으로 플레이"
                    icon
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(168,85,247,0.25)] hover:scale-105"
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
