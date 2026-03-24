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
  return (
    <div className={inModal ? "grid gap-6" : "grid gap-6 lg:grid-cols-[1fr_320px]"}>
      <Card className="fun-panel border-white/70 bg-white/95 shadow-[0_16px_40px_rgba(148,163,184,0.12)]">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="mt-2 leading-7">{subtitle}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="rounded-full bg-slate-100">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">{controls}</div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {!inModal && (
        <div className="grid gap-4">
          <Card className="border-white/70 bg-white/95 shadow-[0_16px_40px_rgba(148,163,184,0.12)]">
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          {aside}
        </div>
      )}
    </div>
  );
}
