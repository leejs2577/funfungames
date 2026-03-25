"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Stat = {
  label: string;
  value: string | number;
};

export function GameViewport({
  aspectRatio,
  className,
  children,
}: {
  aspectRatio: number;
  className?: string;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateSize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width <= 0 || height <= 0) return;

      let fittedWidth = width;
      let fittedHeight = width / aspectRatio;

      if (fittedHeight > height) {
        fittedHeight = height;
        fittedWidth = height * aspectRatio;
      }

      const next = {
        width: Math.max(1, Math.floor(fittedWidth)),
        height: Math.max(1, Math.floor(fittedHeight)),
      };

      setSize((previous) =>
        previous?.width === next.width && previous?.height === next.height ? previous : next,
      );
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(host);

    window.addEventListener("orientationchange", updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", updateSize);
    };
  }, [aspectRatio]);

  return (
    <div ref={hostRef} className={cn("relative flex-1 min-h-0", className)}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: size?.width ?? "100%",
          height: size?.height ?? "100%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  );
}

export function GameFrame({
  title,
  subtitle,
  badges,
  stats,
  controls,
  aside,
  children,
  inModal,
}: {
  title: string;
  subtitle: string;
  badges: string[];
  stats: Stat[];
  controls: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  inModal?: boolean;
}) {
  if (inModal) {
    return (
      <div className="flex h-full flex-col gap-1.5 sm:gap-2">
        {/* Slim control bar: badges + controls */}
        <div className="shrink-0 flex flex-wrap items-center gap-1 sm:gap-2">
          {badges.slice(0, 3).map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className="rounded-full border border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] text-xs"
            >
              {badge}
            </Badge>
          ))}
          <div className="ml-auto flex flex-wrap items-center gap-1 sm:gap-2">{controls}</div>
        </div>
        {/* Game content - fits remaining space */}
        <div className="flex-1 min-h-0 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="fun-panel bg-[var(--arcade-card)]">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl text-slate-100">{title}</CardTitle>
              <CardDescription className="mt-2 leading-7 text-slate-400">{subtitle}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="rounded-full border border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">{controls}</div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="fun-panel bg-[var(--arcade-card)]">
          <CardHeader>
            <CardTitle
              className="text-lg text-[var(--neon-cyan)]"
              style={{ textShadow: "0 0 10px rgba(0,229,255,0.3)" }}
            >
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--neon-cyan)]/15 bg-[var(--arcade-bg)]/60 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-[var(--neon-cyan)]">{stat.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        {aside}
      </div>
    </div>
  );
}
