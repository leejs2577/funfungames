"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openGame } from "@/lib/open-game";

interface PlayButtonProps {
  slug: string;
  label: string;
  icon?: boolean;
  className?: string;
}

export function PlayButton({ slug, label, icon, className }: PlayButtonProps) {
  return (
    <Button
      className={cn("rounded-full", className)}
      onClick={() => openGame(slug)}
    >
      {icon && <Play className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}
