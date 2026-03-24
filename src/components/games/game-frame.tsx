"use client";

import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col gap-3">
        {/* Slim control bar: badges + controls */}
        <div className="flex flex-wrap items-center gap-2">
          {badges.slice(0, 3).map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className="rounded-full border border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] text-xs"
            >
              {badge}
            </Badge>
          ))}
          <div className="ml-auto flex flex-wrap gap-2">{controls}</div>
        </div>
        {/* Game content */}
        <div>{children}</div>
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
