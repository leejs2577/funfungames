"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GameFrame } from "@/components/games/game-frame";
import { MobileControls } from "@/components/games/mobile-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GRID = 12;
const INITIAL_SNAKE = [
  { x: 5, y: 6 },
  { x: 4, y: 6 },
  { x: 3, y: 6 },
];

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((part) => `${part.x},${part.y}`));
  let point = { x: 0, y: 0 };
  do {
    point = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (occupied.has(`${point.x},${point.y}`));
  return point;
}

export function SnakeGame({ inModal }: { inModal?: boolean } = {}) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 9, y: 6 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Press start and use arrow keys.");
  const [best, setBest] = useState(0);
  const directionRef = useRef<Direction>("RIGHT");

  const score = snake.length - INITIAL_SNAKE.length;

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setIsRunning(false);
    setStatus("Colorful run reset.");
  };

  useEffect(() => {
    const id = window.setTimeout(() => setFood(randomFood(INITIAL_SNAKE)), 0);
    return () => window.clearTimeout(id);
  }, []);

  const handleDirection = useCallback((nextDirection: Direction) => {
    const opposite =
      (directionRef.current === "UP" && nextDirection === "DOWN") ||
      (directionRef.current === "DOWN" && nextDirection === "UP") ||
      (directionRef.current === "LEFT" && nextDirection === "RIGHT") ||
      (directionRef.current === "RIGHT" && nextDirection === "LEFT");

    if (!opposite) {
      directionRef.current = nextDirection;
      setDirection(nextDirection);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const directionMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      const nextDirection = directionMap[event.key];
      if (!nextDirection) return;
      event.preventDefault();
      handleDirection(nextDirection);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDirection]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const deltaMap: Record<Direction, Point> = {
          UP: { x: 0, y: -1 },
          DOWN: { x: 0, y: 1 },
          LEFT: { x: -1, y: 0 },
          RIGHT: { x: 1, y: 0 },
        };

        const delta = deltaMap[directionRef.current];
        const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
        const hitWall =
          nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= GRID || nextHead.y >= GRID;
        const hitSelf = currentSnake.some(
          (part) => part.x === nextHead.x && part.y === nextHead.y,
        );

        if (hitWall || hitSelf) {
          setIsRunning(false);
          setStatus("Boom! Try another run.");
          return currentSnake;
        }

        const nextSnake = [nextHead, ...currentSnake];
        if (nextHead.x === food.x && nextHead.y === food.y) {
          const nextScore = nextSnake.length - INITIAL_SNAKE.length;
          setBest((currentBest) => Math.max(currentBest, nextScore));
          setFood(randomFood(nextSnake));
          setStatus("Yum! Fruit collected.");
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, 170);

    return () => window.clearInterval(interval);
  }, [food, isRunning]);

  const cells = useMemo(
    () =>
      Array.from({ length: GRID * GRID }, (_, index) => {
        const x = index % GRID;
        const y = Math.floor(index / GRID);
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        const isBody = snake.slice(1).some((part) => part.x === x && part.y === y);
        const isFood = food.x === x && food.y === y;
        return { x, y, isHead, isBody, isFood };
      }),
    [food, snake],
  );

  return (
    <GameFrame
      title="Snake"
      subtitle="네온 컬러의 뱀을 조종해 과일을 먹고 점수를 키우는 빠른 아케이드 게임입니다."
      badges={["Arcade", "Neon", "Fast"]}
      inModal={inModal}
      stats={[
        { label: "Score", value: score },
        { label: "Best", value: best },
        { label: "Direction", value: direction },
      ]}
      controls={
        <>
          <Button
            onClick={() => setIsRunning(true)}
            className="rounded-full bg-gradient-to-r from-[var(--neon-green)] to-[#00e5ff] text-black font-bold shadow-[0_0_20px_rgba(57,255,20,0.3)]"
          >
            Start
          </Button>
          <Button
            onClick={() => setIsRunning(false)}
            className="rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--arcade-card)] text-slate-300 hover:border-[var(--neon-cyan)]/60 hover:text-[var(--neon-cyan)]"
          >
            Pause
          </Button>
          <Button
            onClick={resetGame}
            className="rounded-full border border-slate-600 bg-transparent text-slate-400 hover:border-slate-400 hover:text-slate-200"
          >
            Reset
          </Button>
          <p className="text-sm text-slate-400">{status}</p>
        </>
      }
      aside={
        <Card className="fun-panel bg-[var(--arcade-card)]">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--neon-green)]">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-400">
            <p>Arrow keys: move</p>
            <p>머리는 더 밝게, 과일은 더 반짝이게 보여서 가독성을 높였습니다.</p>
          </CardContent>
        </Card>
      }
    >
      <div className="mx-auto grid w-full max-w-xl grid-cols-12 gap-1 rounded-[2rem] bg-gradient-to-br from-emerald-100 via-white to-sky-100 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        {cells.map((cell) => (
          <div
            key={`${cell.x}-${cell.y}`}
            className={[
              "aspect-square rounded-xl transition-all duration-150",
              cell.isHead
                ? "scale-105 bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_16px_rgba(168,85,247,0.4)]"
                : "",
              cell.isBody
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_6px_14px_rgba(16,185,129,0.22)]"
                : "",
              cell.isFood
                ? "animate-pulse-glow bg-gradient-to-br from-rose-400 to-orange-400 shadow-[0_0_18px_rgba(251,113,133,0.4)]"
                : "",
              !cell.isHead && !cell.isBody && !cell.isFood ? "bg-white/85" : "",
            ].join(" ")}
          />
        ))}
      </div>
      <MobileControls
        onDirection={(dir) => {
          const dirMap = { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT" } as const;
          handleDirection(dirMap[dir]);
        }}
        disabled={!isRunning}
      />
    </GameFrame>
  );
}
