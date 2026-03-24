import Link from "next/link";
import { Gamepad2, Home, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-rose-400 text-white shadow-[0_12px_30px_rgba(217,70,239,0.25)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
            <Gamepad2 className="size-5" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-900">FunFUnGames</p>
            <p className="text-xs text-slate-500">Bright casual mini arcade</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" className="rounded-full text-slate-700 hover:bg-rose-50">
            <Link href="/">
              <Home className="mr-2 size-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full text-slate-700 hover:bg-sky-50">
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
