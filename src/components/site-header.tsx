import Link from "next/link";
import { Gamepad2, Home, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--neon-cyan)]/20 bg-[#0a0a1a]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00e5ff] to-[#ff00aa] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]">
            <Gamepad2 className="size-5" />
          </div>
          <div>
            <p
              className="text-sm font-bold tracking-tight text-[var(--neon-cyan)]"
              style={{
                fontFamily: "var(--font-arcade)",
                textShadow: "0 0 10px rgba(0,229,255,0.5), 0 0 20px rgba(0,229,255,0.2)",
              }}
            >
              FunFUnGames
            </p>
            <p className="text-xs text-slate-500">Retro Arcade Portal</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="rounded-lg text-slate-300 hover:bg-[var(--neon-cyan)]/10 hover:text-[var(--neon-cyan)]"
          >
            <Link href="/">
              <Home className="mr-2 size-4" />
              Home
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-lg text-slate-300 hover:bg-[var(--neon-magenta)]/10 hover:text-[var(--neon-magenta)]"
          >
            <Link href="/games">
              <Sparkles className="mr-2 size-4" />
              Games
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
