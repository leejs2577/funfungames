"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GameFrame } from "@/components/games/game-frame";
import { MobileControls } from "@/components/games/mobile-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Cell = 0 | string;
type Board = Cell[][];
type PieceKey = keyof typeof SHAPES;

const WIDTH = 10;
const HEIGHT = 20;

const SHAPES = {
  I: { color: "#38bdf8", blocks: [[1, 1, 1, 1]] },
  O: { color: "#facc15", blocks: [[1, 1], [1, 1]] },
  T: { color: "#a855f7", blocks: [[0, 1, 0], [1, 1, 1]] },
  L: { color: "#fb923c", blocks: [[1, 0, 0], [1, 1, 1]] },
  J: { color: "#6366f1", blocks: [[0, 0, 1], [1, 1, 1]] },
  S: { color: "#22c55e", blocks: [[0, 1, 1], [1, 1, 0]] },
  Z: { color: "#ef4444", blocks: [[1, 1, 0], [0, 1, 1]] },
};

const STATIC_PIECE = {
  key: "I" as PieceKey,
  color: SHAPES.I.color,
  blocks: SHAPES.I.blocks,
  x: Math.floor(WIDTH / 2) - Math.ceil(SHAPES.I.blocks[0].length / 2),
  y: 0,
};

function createBoard(): Board {
  return Array.from({ length: HEIGHT }, () => Array<Cell>(WIDTH).fill(0));
}

function rotate(blocks: number[][]) {
  return blocks[0].map((_, index) => blocks.map((row) => row[index]).reverse());
}

function randomPiece() {
  const keys = Object.keys(SHAPES) as PieceKey[];
  const key = keys[Math.floor(Math.random() * keys.length)];
  const shape = SHAPES[key];
  return {
    key,
    color: shape.color,
    blocks: shape.blocks,
    x: Math.floor(WIDTH / 2) - Math.ceil(shape.blocks[0].length / 2),
    y: 0,
  };
}

function collides(board: Board, piece: ReturnType<typeof randomPiece>) {
  return piece.blocks.some((row, rowIndex) =>
    row.some((value, columnIndex) => {
      if (!value) return false;
      const x = piece.x + columnIndex;
      const y = piece.y + rowIndex;
      return x < 0 || x >= WIDTH || y >= HEIGHT || (y >= 0 && board[y][x] !== 0);
    }),
  );
}

function merge(board: Board, piece: ReturnType<typeof randomPiece>) {
  const next = board.map((row) => [...row]);
  piece.blocks.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (!value) return;
      const x = piece.x + columnIndex;
      const y = piece.y + rowIndex;
      if (y >= 0) next[y][x] = piece.color;
    });
  });
  return next;
}

function clearLines(board: Board) {
  const kept = board.filter((row) => row.some((cell) => cell === 0));
  const lines = HEIGHT - kept.length;
  const freshRows = Array.from({ length: lines }, () => Array<Cell>(WIDTH).fill(0));
  return { board: [...freshRows, ...kept], lines };
}

export function TetrisGame({ inModal }: { inModal?: boolean } = {}) {
  const [board, setBoard] = useState<Board>(createBoard);
  const [piece, setPiece] = useState(STATIC_PIECE);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("Press start to play Tetris.");
  const framePiece = useRef(piece);
  const boardRef = useRef(board);

  useEffect(() => {
    framePiece.current = piece;
  }, [piece]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    const id = window.setTimeout(() => setPiece(randomPiece()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setPiece(randomPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setRunning(false);
    setGameOver(false);
    setStatus("Fresh neon board ready.");
  }, []);

  const settlePiece = useCallback(() => {
    setBoard((currentBoard) => {
      const merged = merge(currentBoard, framePiece.current);
      const cleared = clearLines(merged);

      if (cleared.lines > 0) {
        setLines((currentLines) => {
          const total = currentLines + cleared.lines;
          setLevel(Math.floor(total / 5) + 1);
          return total;
        });
        setScore((currentScore) => currentScore + cleared.lines * 150);
        setStatus(`${cleared.lines} line cleared!`);
      }

      const nextPiece = randomPiece();
      if (collides(cleared.board, nextPiece)) {
        setRunning(false);
        setGameOver(true);
        setStatus("Game over! Press Start to play again.");
      } else {
        setPiece(nextPiece);
      }
      return cleared.board;
    });
  }, []);

  const movePiece = useCallback(
    (dx: number, dy: number, rotateNext = false) => {
      setPiece((currentPiece) => {
        const candidate = {
          ...currentPiece,
          x: currentPiece.x + dx,
          y: currentPiece.y + dy,
          blocks: rotateNext ? rotate(currentPiece.blocks) : currentPiece.blocks,
        };

        if (!collides(boardRef.current, candidate)) return candidate;

        if (dy === 1 && !rotateNext && dx === 0) {
          framePiece.current = currentPiece;
          window.setTimeout(settlePiece, 0);
        }

        return currentPiece;
      });
    },
    [settlePiece],
  );

  const hardDrop = useCallback(() => {
    setPiece((currentPiece) => {
      let dropped = { ...currentPiece };
      while (
        !collides(boardRef.current, {
          ...dropped,
          y: dropped.y + 1,
        })
      ) {
        dropped = { ...dropped, y: dropped.y + 1 };
      }
      framePiece.current = dropped;
      setStatus("Hard drop!");
      window.setTimeout(settlePiece, 0);
      return dropped;
    });
  }, [settlePiece]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && !running) {
        event.preventDefault();
        if (gameOver) resetGame();
        setRunning(true);
        return;
      }
      if (!running) return;
      if (event.key.startsWith("Arrow") || event.key === " ") event.preventDefault();

      if (event.key === "ArrowLeft") movePiece(-1, 0);
      if (event.key === "ArrowRight") movePiece(1, 0);
      if (event.key === "ArrowDown") movePiece(0, 1);
      if (event.key === "ArrowUp") movePiece(0, 0, true);
      if (event.key === " ") hardDrop();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameOver, hardDrop, movePiece, resetGame, running]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(
      () => movePiece(0, 1),
      Math.max(120, 520 - (level - 1) * 40),
    );
    return () => window.clearInterval(interval);
  }, [level, movePiece, running]);

  const renderedBoard = useMemo(() => {
    const preview = board.map((row) => [...row]);
    piece.blocks.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (!value) return;
        const x = piece.x + columnIndex;
        const y = piece.y + rowIndex;
        if (preview[y] && preview[y][x] !== undefined) preview[y][x] = piece.color;
      });
    });
    return preview;
  }, [board, piece]);

  return (
    <GameFrame
      title="Tetris"
      subtitle="더 선명한 대비와 네온 보드로 재구성한 클래식 퍼즐 플레이입니다."
      badges={["Arcade", "Neon", "Hard drop"]}
      stats={[
        { label: "Score", value: score },
        { label: "Lines", value: lines },
        { label: "Level", value: level },
      ]}
      inModal={inModal}
      controls={
        <>
          <Button
            onClick={() => { if (gameOver) resetGame(); setRunning(true); }}
            className="rounded-full bg-gradient-to-r from-[#00e5ff] to-[#6366f1] text-black font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Start
          </Button>
          <Button
            onClick={() => setRunning(false)}
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
            <CardTitle className="text-lg text-[var(--neon-cyan)]">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-400">
            <p>← → 이동 / ↑ 회전 / ↓ 빠른 낙하 / Space 하드드롭</p>
            <p>스페이스를 누르면 현재 블록이 맨 아래까지 즉시 떨어집니다.</p>
          </CardContent>
        </Card>
      }
    >
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="aspect-[1/2] max-h-full w-auto rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.45)]">
          <div className="grid h-full w-full grid-cols-10 gap-1">
            {renderedBoard.flatMap((row, rowIndex) =>
              row.map((cell, columnIndex) => (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className="rounded-md border border-white/5"
                  style={{
                    backgroundColor: cell || "rgba(255,255,255,0.08)",
                    boxShadow: cell
                      ? "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 14px rgba(255,255,255,0.12)"
                      : "none",
                  }}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <MobileControls
        onDirection={(dir) => {
          if (!running) return;
          if (dir === "left") movePiece(-1, 0);
          if (dir === "right") movePiece(1, 0);
          if (dir === "down") movePiece(0, 1);
          if (dir === "up") movePiece(0, 0, true);
        }}
        onAction={hardDrop}
        actionLabel="DROP"
        onStart={() => { if (gameOver) resetGame(); setRunning(true); }}
        startLabel="START"
        disabled={!running}
      />
    </GameFrame>
  );
}
