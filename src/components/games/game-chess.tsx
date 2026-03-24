"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameFrame } from "@/components/games/game-frame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Types
type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";
type PieceColor = "w" | "b";
type Piece = { type: PieceType; color: PieceColor };
type Square = Piece | null;
type Board = Square[][];
type Move = {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  promotion?: PieceType;
  isCastle?: "K" | "Q";
  isEnPassant?: boolean;
};

type CastlingRights = {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
};

// Constants
const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  w: { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙" },
  b: { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" },
};

const PIECE_VALUE: Record<PieceType, number> = {
  P: 100,
  N: 320,
  B: 330,
  R: 500,
  Q: 900,
  K: 20000,
};

const DIFFICULTY_LEVELS = [
  { key: 1 as const, label: "초보" },
  { key: 2 as const, label: "입문" },
  { key: 3 as const, label: "중급" },
  { key: 4 as const, label: "고급" },
  { key: 5 as const, label: "고수" },
];

const DIFFICULTY_DEPTH: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

// Piece-square tables (simplified, scaled down)
const PST_PAWN = [
  0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30,
  30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5,
  -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0,
  0, 0, 0,
];

const PST_KNIGHT = [
  -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0,
  15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5,
  0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50,
];

const PST_BISHOP = [
  -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0,
  5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10,
  0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20,
  -10, -10, -10, -10, -10, -10, -20,
];

const PST_ROOK = [
  0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0,
  0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0,
  0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
];

const PST_KING = [
  -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
  -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
  -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
  -20, -20, -10, 20, 20, -5, -5, -5, -5, 20, 20, 20, 30, 10, 0, 0, 10, 30,
  20,
];

const PST_MAP: Record<PieceType, number[]> = {
  P: PST_PAWN,
  N: PST_KNIGHT,
  B: PST_BISHOP,
  R: PST_ROOK,
  K: PST_KING,
  Q: [...Array(64)].map(() => 0),
};

// Pure helper functions
function createInitialBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const backRank: PieceType[] = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  backRank.forEach((type, col) => {
    b[0][col] = { type, color: "b" };
  });
  for (let col = 0; col < 8; col++) b[1][col] = { type: "P", color: "b" };
  for (let col = 0; col < 8; col++) b[6][col] = { type: "P", color: "w" };
  backRank.forEach((type, col) => {
    b[7][col] = { type, color: "w" };
  });
  return b;
}

function deepCopyBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function isWhiteSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 0;
}

function getPieceAt(board: Board, row: number, col: number): Piece | null {
  if (row < 0 || row > 7 || col < 0 || col > 7) return null;
  return board[row][col];
}

function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row <= 7 && col >= 0 && col <= 7;
}

function isKingInCheck(board: Board, color: PieceColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const [kr, kc] = kingPos;

  // Check all opponent pieces
  const oppColor = color === "w" ? "b" : "w";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === oppColor) {
        if (canPieceAttack(board, r, c, kr, kc)) {
          return true;
        }
      }
    }
  }
  return false;
}

function findKing(board: Board, color: PieceColor): [number, number] | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === "K" && piece.color === color) {
        return [r, c];
      }
    }
  }
  return null;
}

function canPieceAttack(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  const absRowDiff = Math.abs(rowDiff);
  const absColDiff = Math.abs(colDiff);

  switch (piece.type) {
    case "P":
      const dir = piece.color === "w" ? -1 : 1;
      return rowDiff === dir && absColDiff === 1;
    case "N":
      return (
        (absRowDiff === 2 && absColDiff === 1) ||
        (absRowDiff === 1 && absColDiff === 2)
      );
    case "B":
      if (absRowDiff !== absColDiff || absRowDiff === 0) return false;
      return isPathClear(board, fromRow, fromCol, toRow, toCol);
    case "R":
      if (rowDiff !== 0 && colDiff !== 0) return false;
      return isPathClear(board, fromRow, fromCol, toRow, toCol);
    case "Q":
      if (
        rowDiff !== 0 &&
        colDiff !== 0 &&
        absRowDiff !== absColDiff
      )
        return false;
      return isPathClear(board, fromRow, fromCol, toRow, toCol);
    case "K":
      return absRowDiff <= 1 && absColDiff <= 1;
  }
  return false;
}

function isPathClear(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  const rowStep = toRow === fromRow ? 0 : toRow > fromRow ? 1 : -1;
  const colStep = toCol === fromCol ? 0 : toCol > fromCol ? 1 : -1;

  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  while (r !== toRow || c !== toCol) {
    if (board[r][c] !== null) return false;
    r += rowStep;
    c += colStep;
  }
  return true;
}

function isLegalMove(
  board: Board,
  move: Move,
  enPassant: [number, number] | null,
  castling: CastlingRights,
  color: PieceColor
): boolean {
  const { fromRow, fromCol, toRow, toCol } = move;

  const piece = getPieceAt(board, fromRow, fromCol);
  if (!piece || piece.color !== color) return false;

  const targetSquare = getPieceAt(board, toRow, toCol);
  if (targetSquare && targetSquare.color === color) return false;

  // Simulate move
  const testBoard = deepCopyBoard(board);
  testBoard[toRow][toCol] = testBoard[fromRow][fromCol];
  testBoard[fromRow][fromCol] = null;

  // Can't move into check
  if (isKingInCheck(testBoard, color)) return false;

  return true;
}

function getAllLegalMoves(
  board: Board,
  color: PieceColor,
  enPassant: [number, number] | null,
  castling: CastlingRights
): Move[] {
  const moves: Move[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = getPieceAt(board, r, c);
      if (piece && piece.color === color) {
        // Try all squares
        for (let tr = 0; tr < 8; tr++) {
          for (let tc = 0; tc < 8; tc++) {
            const move: Move = {
              fromRow: r,
              fromCol: c,
              toRow: tr,
              toCol: tc,
            };

            if (isLegalMove(board, move, enPassant, castling, color)) {
              moves.push(move);
            }
          }
        }
      }
    }
  }

  return moves;
}

function evaluateBoard(board: Board): number {
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const value = PIECE_VALUE[piece.type];
        const pstValue = PST_MAP[piece.type][r * 8 + c] || 0;
        const total = value + pstValue * 0.5;
        score += piece.color === "w" ? total : -total;
      }
    }
  }

  return score;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0) return evaluateBoard(board);

  const color: PieceColor = isMaximizing ? "b" : "w";
  const moves = getAllLegalMoves(board, color, null, {
    wK: false,
    wQ: false,
    bK: false,
    bQ: false,
  });

  if (moves.length === 0) {
    if (isKingInCheck(board, color)) {
      return isMaximizing ? -99999 : 99999;
    }
    return 0;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const next = deepCopyBoard(board);
      next[move.toRow][move.toCol] = next[move.fromRow][move.fromCol];
      next[move.fromRow][move.fromCol] = null;
      const score = minimax(next, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const next = deepCopyBoard(board);
      next[move.toRow][move.toCol] = next[move.fromRow][move.fromCol];
      next[move.fromRow][move.fromCol] = null;
      const score = minimax(next, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestMove(board: Board, depth: number): Move | null {
  const moves = getAllLegalMoves(board, "b", null, {
    wK: false,
    wQ: false,
    bK: false,
    bQ: false,
  });
  if (!moves.length) return null;

  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (const move of moves) {
    const next = deepCopyBoard(board);
    next[move.toRow][move.toCol] = next[move.fromRow][move.fromCol];
    next[move.fromRow][move.fromCol] = null;
    const score = minimax(next, depth - 1, -Infinity, Infinity, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function formatMove(move: Move): string {
  const colFrom = String.fromCharCode(97 + move.fromCol);
  const rowFrom = 8 - move.fromRow;
  const colTo = String.fromCharCode(97 + move.toCol);
  const rowTo = 8 - move.toRow;
  return `${colFrom}${rowFrom}-${colTo}${rowTo}`;
}

// Component
export function ChessGame({ inModal }: { inModal?: boolean } = {}) {
  const [board, setBoard] = useState<Board>(createInitialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<PieceColor>("w");
  const [status, setStatus] = useState("당신의 차례입니다 (흰색)");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [capturedByWhite, setCapturedByWhite] = useState<Piece[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<Piece[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [flashCell, setFlashCell] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [castlingRights, setCastlingRights] = useState<CastlingRights>({
    wK: true,
    wQ: true,
    bK: true,
    bQ: true,
  });

  const boardRef = useRef(board);
  const turnRef = useRef(turn);
  const castlingRef = useRef(castlingRights);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);
  useEffect(() => {
    castlingRef.current = castlingRights;
  }, [castlingRights]);

  const isInCheck = useMemo(() => isKingInCheck(board, turn), [board, turn]);

  const legalMoves = useMemo(
    () =>
      selected
        ? getAllLegalMoves(board, "w", null, castlingRights).filter(
            (m) => m.fromRow === selected[0] && m.fromCol === selected[1]
          )
        : [],
    [board, selected, castlingRights]
  );

  const isCheckmate = useMemo(() => {
    if (!isInCheck) return false;
    const allMoves = getAllLegalMoves(board, turn, null, castlingRights);
    return allMoves.length === 0;
  }, [board, turn, isInCheck, castlingRights]);

  const isStalemate = useMemo(() => {
    if (isInCheck) return false;
    const allMoves = getAllLegalMoves(board, turn, null, castlingRights);
    return allMoves.length === 0;
  }, [board, turn, isInCheck, castlingRights]);

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setSelected(null);
    setTurn("w");
    setStatus("당신의 차례입니다 (흰색)");
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setMoveHistory([]);
    setFlashCell(null);
    setCastlingRights({ wK: true, wQ: true, bK: true, bQ: true });
  }, []);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (turn !== "w" || isThinking || isCheckmate || isStalemate)
        return;

      if (selected === null) {
        const piece = getPieceAt(board, row, col);
        if (piece && piece.color === "w") {
          setSelected([row, col]);
        }
      } else {
        const move: Move = {
          fromRow: selected[0],
          fromCol: selected[1],
          toRow: row,
          toCol: col,
        };

        if (isLegalMove(board, move, null, castlingRights, "w")) {
          const nextBoard = deepCopyBoard(board);
          const capturedPiece = nextBoard[row][col];
          nextBoard[row][col] = nextBoard[selected[0]][selected[1]];
          nextBoard[selected[0]][selected[1]] = null;

          if (capturedPiece) {
            setCapturedByWhite((prev) => [...prev, capturedPiece]);
            setFlashCell(`${row},${col}`);
            window.setTimeout(() => setFlashCell(null), 600);
          }

          setBoard(nextBoard);
          setMoveHistory((prev) => [...prev, formatMove(move)]);
          setTurn("b");
          setStatus("AI가 생각 중입니다...");
          setSelected(null);
        } else {
          setSelected(null);
        }
      }
    },
    [selected, board, turn, isThinking, isCheckmate, isStalemate, castlingRights]
  );

  // AI turn
  useEffect(() => {
    if (turn !== "b" || isCheckmate || isStalemate) return;

    setIsThinking(true);
    const id = window.setTimeout(() => {
      const depth = DIFFICULTY_DEPTH[difficulty];
      const move = getBestMove(boardRef.current, depth);

      if (move) {
        const nextBoard = deepCopyBoard(boardRef.current);
        const capturedPiece = nextBoard[move.toRow][move.toCol];
        nextBoard[move.toRow][move.toCol] =
          nextBoard[move.fromRow][move.fromCol];
        nextBoard[move.fromRow][move.fromCol] = null;

        if (capturedPiece) {
          setCapturedByBlack((prev) => [...prev, capturedPiece]);
          setFlashCell(`${move.toRow},${move.toCol}`);
          window.setTimeout(() => setFlashCell(null), 600);
        }

        setBoard(nextBoard);
        setMoveHistory((prev) => [...prev, formatMove(move)]);
        setTurn("w");
        setStatus("당신의 차례입니다 (흰색)");
      }
      setIsThinking(false);
    }, 500);

    return () => window.clearTimeout(id);
  }, [turn, difficulty, isCheckmate, isStalemate]);

  return (
    <GameFrame
      title="Chess"
      subtitle="5단계 난이도의 AI와 대전하는 체스 게임입니다. 기물을 잡으면 전투 이펙트가 터집니다!"
      badges={DIFFICULTY_LEVELS.map((l) => (difficulty === l.key ? `[${l.label}]` : l.label))}
      stats={[
        {
          label: "차례",
          value:
            turn === "w"
              ? "당신 (흰)"
              : isThinking
                ? "AI 생각중..."
                : "AI (검)",
        },
        { label: "내가 잡은", value: capturedByWhite.length },
        { label: "AI가 잡은", value: capturedByBlack.length },
      ]}
      inModal={inModal}
      controls={
        <>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_LEVELS.map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => setDifficulty(key)}
                variant={difficulty === key ? "default" : "outline"}
                className="rounded-full text-xs sm:text-sm"
              >
                {label}
              </Button>
            ))}
          </div>
          <Button
            onClick={resetGame}
            variant="outline"
            className="rounded-full text-sm"
          >
            새 게임
          </Button>
          <p className="text-sm text-slate-500">
            {isCheckmate
              ? "체크메이트! 게임 끝!"
              : isStalemate
                ? "스테일메이트! 비김!"
                : isInCheck && turn === "w"
                  ? "⚠️ 당신이 체크 상태입니다!"
                  : status}
          </p>
        </>
      }
      aside={
        <Card className="border-white/70 bg-white/95 shadow-[0_16px_40px_rgba(148,163,184,0.12)]">
          <CardHeader>
            <CardTitle className="text-lg">이동 기록</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto space-y-1 text-xs sm:text-sm font-mono text-slate-600">
            {moveHistory.length === 0 ? (
              <p className="text-slate-400">게임을 시작하세요</p>
            ) : (
              moveHistory.map((move, i) => (
                <p key={i}>
                  {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : "   "}
                  {move}
                </p>
              ))
            )}
          </CardContent>
        </Card>
      }
    >
      {/* Chess board */}
      <div className="mx-auto grid w-full max-w-2xl grid-cols-8 rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.25)]">
        {board.flatMap((row, rowIndex) =>
          row.map((square, colIndex) => {
            const cellKey = `${rowIndex},${colIndex}`;
            const isLight = isWhiteSquare(rowIndex, colIndex);
            const isSelected =
              selected?.[0] === rowIndex && selected?.[1] === colIndex;
            const isLegalTarget = legalMoves.some(
              (m) => m.toRow === rowIndex && m.toCol === colIndex
            );
            const isFlashing = flashCell === cellKey;

            return (
              <button
                key={cellKey}
                type="button"
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                disabled={isThinking || isCheckmate || isStalemate}
                className={cn(
                  "aspect-square flex items-center justify-center relative text-3xl select-none",
                  isLight ? "bg-amber-50" : "bg-amber-700/70",
                  isSelected ? "bg-violet-200 ring-2 ring-violet-400" : "",
                  isLegalTarget && !square ? "bg-violet-100" : "",
                  isFlashing && "animate-battle-flash",
                  !isThinking &&
                    !isCheckmate &&
                    !isStalemate &&
                    "hover:opacity-80 transition-opacity duration-150 cursor-pointer"
                )}
              >
                {isLegalTarget && !square && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-violet-400/50" />
                  </span>
                )}
                {square && (
                  <span
                    className={cn(
                      square.color === "w"
                        ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                        : "text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]",
                      isSelected && "scale-110"
                    )}
                  >
                    {PIECE_SYMBOLS[square.color][square.type]}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Captured pieces display */}
      {capturedByWhite.length > 0 && (
        <div className="mt-4 text-center text-sm">
          <p className="text-slate-600 font-medium">내가 잡은 기물:</p>
          <p className="text-xl">
            {capturedByWhite
              .map((p) => PIECE_SYMBOLS.b[p.type])
              .join(" ")}
          </p>
        </div>
      )}
      {capturedByBlack.length > 0 && (
        <div className="mt-2 text-center text-sm">
          <p className="text-slate-600 font-medium">AI가 잡은 기물:</p>
          <p className="text-xl">
            {capturedByBlack.map((p) => PIECE_SYMBOLS.w[p.type]).join(" ")}
          </p>
        </div>
      )}
    </GameFrame>
  );
}
