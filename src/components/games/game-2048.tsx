"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { GameFrame, GameViewport } from "@/components/games/game-frame";
import { MobileControls } from "@/components/games/mobile-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Board = number[][];

const SIZE = 4;

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function randomFill(board: Board) {
  const spots: Array<[number, number]> = [];
  board.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === 0) spots.push([y, x]);
    }),
  );
  if (!spots.length) return board;
  const [y, x] = spots[Math.floor(Math.random() * spots.length)];
  board[y][x] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function createStartBoard() {
  return randomFill(randomFill(emptyBoard()));
}

function rotateLeft(board: Board): Board {
  return board[0].map((_, index) => board.map((row) => row[row.length - 1 - index]));
}

function slideRowLeft(row: number[]) {
  const compact = row.filter(Boolean);
  let score = 0;
  const merged: number[] = [];

  for (let i = 0; i < compact.length; i += 1) {
    if (compact[i] !== 0 && compact[i] === compact[i + 1]) {
      const value = compact[i] * 2;
      merged.push(value);
      score += value;
      i += 1;
    } else {
      merged.push(compact[i]);
    }
  }

  while (merged.length < SIZE) merged.push(0);
  return { row: merged, score };
}

function moveBoard(board: Board, direction: "left" | "right" | "up" | "down") {
  let rotated = board.map((row) => [...row]);
  let rotationCount = 0;

  if (direction === "up") rotationCount = 1;
  if (direction === "right") rotationCount = 2;
  if (direction === "down") rotationCount = 3;

  for (let i = 0; i < rotationCount; i += 1) {
    rotated = rotateLeft(rotated);
  }

  let gained = 0;
  const shifted = rotated.map((row) => {
    const result = slideRowLeft(row);
    gained += result.score;
    return result.row;
  });

  let restored = shifted;
  for (let i = 0; i < (4 - rotationCount) % 4; i += 1) {
    restored = rotateLeft(restored);
  }

  const changed = JSON.stringify(board) !== JSON.stringify(restored);
  return { board: changed ? randomFill(restored) : restored, gained, changed };
}

function hasMoves(board: Board) {
  if (board.some((row) => row.includes(0))) return true;
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const current = board[y][x];
      if (board[y]?.[x + 1] === current || board[y + 1]?.[x] === current) return true;
    }
  }
  return false;
}

function tileStyle(value: number) {
  const map: Record<number, string> = {
    0: "bg-white/80 text-slate-300 border border-white",
    2: "bg-gradient-to-br from-rose-100 to-pink-200 text-rose-700 shadow-[0_12px_20px_rgba(251,113,133,0.18)]",
    4: "bg-gradient-to-br from-orange-100 to-amber-200 text-orange-800 shadow-[0_12px_20px_rgba(251,146,60,0.18)]",
    8: "bg-gradient-to-br from-amber-200 to-yellow-300 text-amber-900 shadow-[0_12px_20px_rgba(245,158,11,0.2)]",
    16: "bg-gradient-to-br from-lime-200 to-emerald-300 text-emerald-900 shadow-[0_12px_20px_rgba(34,197,94,0.2)]",
    32: "bg-gradient-to-br from-emerald-200 to-teal-300 text-teal-900 shadow-[0_12px_20px_rgba(20,184,166,0.2)]",
    64: "bg-gradient-to-br from-sky-200 to-cyan-300 text-sky-900 shadow-[0_12px_20px_rgba(14,165,233,0.2)]",
    128: "bg-gradient-to-br from-violet-200 to-purple-300 text-violet-900 shadow-[0_12px_20px_rgba(139,92,246,0.22)]",
    256: "bg-gradient-to-br from-fuchsia-200 to-pink-300 text-fuchsia-900 shadow-[0_12px_20px_rgba(217,70,239,0.22)]",
    512: "bg-gradient-to-br from-indigo-300 to-violet-400 text-white shadow-[0_12px_20px_rgba(99,102,241,0.22)]",
    1024: "bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-[0_12px_22px_rgba(15,23,42,0.35)]",
    2048:
      "bg-gradient-to-br from-amber-300 via-yellow-300 to-orange-400 text-slate-900 shadow-[0_0_24px_rgba(251,191,36,0.55)] animate-pulse-glow",
  };

  return map[value] ?? "bg-slate-900 text-white";
}

export function Game2048({ inModal }: { inModal?: boolean } = {}) {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState("Use arrow keys to slide the tiles.");

  const won = useMemo(() => board.some((row) => row.includes(2048)), [board]);
  const gameOver = useMemo(() => !hasMoves(board), [board]);

  const resetGame = useCallback(() => {
    setBoard(createStartBoard());
    setScore(0);
    setStatus("Fresh sparkling board ready.");
  }, []);

  const handleDirection = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (won || gameOver) return;
      setBoard((current) => {
        const next = moveBoard(current, direction);
        if (next.changed) {
          setScore((previous) => {
            const updated = previous + next.gained;
            setBest((currentBest) => Math.max(currentBest, updated));
            return updated;
          });
          setStatus(`Moved ${direction}.`);
        }
        return next.board;
      });
    },
    [won, gameOver],
  );

  useEffect(() => {
    const id = window.setTimeout(() => setBoard(createStartBoard()), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && (won || gameOver)) {
        event.preventDefault();
        resetGame();
        return;
      }

      const directionMap: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };

      const direction = directionMap[event.key];
      if (!direction) return;
      event.preventDefault();
      handleDirection(direction);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDirection, won, gameOver, resetGame]);

  const displayStatus = won
    ? "2048 achieved! Glitter victory!"
    : gameOver
      ? "No moves left. Press Restart!"
      : status;

  return (
    <GameFrame
      title="2048"
      subtitle="같은 숫자를 합쳐서 2048 타일까지 키우는 반짝이는 퍼즐 게임입니다."
      badges={["Keyboard", "Puzzle", "Sparkly"]}
      stats={[
        { label: "Score", value: score },
        { label: "Best", value: best },
        { label: "State", value: won ? "Won" : gameOver ? "Over" : "Playing" },
      ]}
      inModal={inModal}
      controls={
        <>
          <Button
            onClick={resetGame}
            className="rounded-full bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Restart
          </Button>
          <p className="text-sm text-slate-400">{displayStatus}</p>
        </>
      }
      aside={
        <Card className="fun-panel bg-[var(--arcade-card)]">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--neon-cyan)]">Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-400">
            <p>큰 숫자는 한쪽 구석으로 몰아두면 안정적으로 성장합니다.</p>
            <p>빈 칸을 유지하면서 타일 흐름을 한 방향으로 정리해보세요.</p>
          </CardContent>
        </Card>
      }
    >
      <GameViewport aspectRatio={1}>
        <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-rose-100 via-white to-sky-100 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="grid h-full w-full grid-cols-4 gap-3">
            {board.flatMap((row, rowIndex) =>
              row.map((value, columnIndex) => (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={`flex items-center justify-center rounded-3xl text-2xl font-black transition-colors duration-300 ${tileStyle(
                    value,
                  )}`}
                >
                  {value !== 0 ? value : ""}
                </div>
              )),
            )}
          </div>
        </div>
      </GameViewport>
      <MobileControls
        onDirection={handleDirection}
        onStart={resetGame}
        startLabel="RESTART"
        disabled={won || gameOver}
      />
    </GameFrame>
  );
}
