"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      onClick={() =>
        window.open(
          `/games/${slug}/play`,
          `game-${slug}`,
          "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no"
        )
      }
    >
      {icon && <Play className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}
