"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameFrame, GameViewport } from "@/components/games/game-frame";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";
type Color = "w" | "b";
type Piece = { type: PieceType; color: Color };
type Square = Piece | null;
type Board = Square[][];
type Move = {
  from: [number, number];
  to: [number, number];
  promotion?: PieceType;
  castle?: "K" | "Q";
  enPassant?: boolean;
  captured?: Piece;
};
type CastlingRights = { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };

// ─── Piece SVG Components ─────────────────────────────────────────────────────
function PieceSVG({ type, color }: { type: PieceType; color: Color }) {
  const isWhite = color === "w";

  const defs = (
    <defs>
      <radialGradient id={`g-${color}-body`} cx="50%" cy="35%" r="60%">
        <stop offset="0%" stopColor={isWhite ? "#fffdf0" : "#4a4a5a"} />
        <stop offset="100%" stopColor={isWhite ? "#d4b483" : "#1a1a2e"} />
      </radialGradient>
      <radialGradient id={`g-${color}-hi`} cx="40%" cy="30%" r="40%">
        <stop offset="0%" stopColor={isWhite ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)"} />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
      <filter id={`sh-${color}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={isWhite ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.6)"} />
      </filter>
    </defs>
  );

  const stroke = isWhite ? "#a08040" : "#888899";
  const fill = `url(#g-${color}-body)`;
  const hi = `url(#g-${color}-hi)`;
  const f = `filter:url(#sh-${color})`;

  if (type === "K") return (
    <svg viewBox="0 0 45 45" className="w-full h-full">
      {defs}
      <g style={{ filter: `url(#sh-${color})` }}>
        <rect x="15" y="1" width="15" height="4" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <rect x="20" y="2" width="5" height="10" rx="1" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <rect x="13" y="5" width="19" height="3" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <polygon points="11,14 34,14 31,11 14,11" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="8" y="14" width="29" height="3" rx="1" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <polygon points="8,17 37,17 35,40 10,40" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="6" y="40" width="33" height="3" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <ellipse cx="22.5" cy="17" rx="14" ry="2" fill={hi} opacity="0.6"/>
      </g>
    </svg>
  );

  if (type === "Q") return (
    <svg viewBox="0 0 45 45" className="w-full h-full">
      {defs}
      <g style={{ filter: `url(#sh-${color})` }}>
        <circle cx="9" cy="6" r="4" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <circle cx="22.5" cy="4" r="4.5" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <circle cx="36" cy="6" r="4" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <circle cx="14" cy="12" r="3.5" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <circle cx="31" cy="12" r="3.5" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <polygon points="9,10 36,10 35,22 10,22" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="8" y="22" width="29" height="3" rx="1" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <polygon points="8,25 37,25 35,40 10,40" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="6" y="40" width="33" height="3" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <ellipse cx="22.5" cy="22" rx="13" ry="2" fill={hi} opacity="0.6"/>
      </g>
    </svg>
  );

  if (type === "R") return (
    <svg viewBox="0 0 45 45" className="w-full h-full">
      {defs}
      <g style={{ filter: `url(#sh-${color})` }}>
        <rect x="9" y="1" width="8" height="9" rx="1" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <rect x="19" y="1" width="7" height="9" rx="1" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <rect x="28" y="1" width="8" height="9" rx="1" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <rect x="9" y="10" width="27" height="3" rx="1" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="12" y="13" width="21" height="24" rx="1" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="8" y="37" width="29" height="4" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <ellipse cx="22.5" cy="37" rx="13" ry="1.5" fill={hi} opacity="0.6"/>
      </g>
    </svg>
  );

  if (type === "B") return (
    <svg viewBox="0 0 45 45" className="w-full h-full">
      {defs}
      <g style={{ filter: `url(#sh-${color})` }}>
        <circle cx="22.5" cy="7" r="4" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <circle cx="22.5" cy="5" r="1.5" fill={isWhite ? "#c0a050" : "#888"} stroke={stroke} strokeWidth="0.5"/>
        <ellipse cx="22.5" cy="16" rx="6" ry="8" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <polygon points="14,24 31,24 28,12 17,12" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <ellipse cx="22.5" cy="36" rx="10" ry="6" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="8" y="40" width="29" height="3" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <ellipse cx="22.5" cy="40" rx="13" ry="1.5" fill={hi} opacity="0.6"/>
      </g>
    </svg>
  );

  if (type === "N") return (
    <svg viewBox="0 0 45 45" className="w-full h-full">
      {defs}
      <g style={{ filter: `url(#sh-${color})` }}>
        <path d="M22,10 C17,5 10,8 9,14 C8,20 12,22 14,26 C15,28 14,30 14,32 L31,32 C31,28 29,24 27,20 C26,17 28,13 26,10 C24,8 22,8 22,10 Z"
          fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <circle cx="16" cy="14" r="2" fill={isWhite ? "#ddd" : "#555"} stroke={stroke} strokeWidth="0.5"/>
        <path d="M12,28 C13,25 15,24 17,25" fill="none" stroke={stroke} strokeWidth="0.8"/>
        <rect x="8" y="32" width="29" height="4" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="6" y="36" width="33" height="3" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <ellipse cx="22.5" cy="36" rx="14" ry="1.5" fill={hi} opacity="0.5"/>
      </g>
    </svg>
  );

  // Pawn
  return (
    <svg viewBox="0 0 45 45" className="w-full h-full">
      {defs}
      <g style={{ filter: `url(#sh-${color})` }}>
        <circle cx="22.5" cy="10" r="7" fill={fill} stroke={stroke} strokeWidth="0.8"/>
        <rect x="17" y="17" width="11" height="8" rx="2" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <polygon points="14,25 31,25 28,32 17,32" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <rect x="10" y="32" width="25" height="4" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.7"/>
        <ellipse cx="22.5" cy="32" rx="11" ry="1.5" fill={hi} opacity="0.6"/>
      </g>
    </svg>
  );
}

// ─── Chess Logic ──────────────────────────────────────────────────────────────
function initBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const backRow: PieceType[] = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  backRow.forEach((t, c) => { b[0][c] = { type: t, color: "b" }; });
  for (let c = 0; c < 8; c++) b[1][c] = { type: "P", color: "b" };
  for (let c = 0; c < 8; c++) b[6][c] = { type: "P", color: "w" };
  backRow.forEach((t, c) => { b[7][c] = { type: t, color: "w" }; });
  return b;
}

function cloneBoard(b: Board): Board {
  return b.map(r => [...r]);
}

function opp(c: Color): Color {
  return c === "w" ? "b" : "w";
}

function findKing(b: Board, c: Color): [number, number] | null {
  for (let r = 0; r < 8; r++)
    for (let col = 0; col < 8; col++)
      if (b[r][col]?.type === "K" && b[r][col]?.color === c)
        return [r, col];
  return null;
}

// Is square [r,c] attacked by color `by`?
function isAttacked(b: Board, r: number, c: number, by: Color): boolean {
  for (let fr = 0; fr < 8; fr++) {
    for (let fc = 0; fc < 8; fc++) {
      const p = b[fr][fc];
      if (!p || p.color !== by) continue;
      if (canAttack(b, p, fr, fc, r, c)) return true;
    }
  }
  return false;
}

function canAttack(b: Board, p: Piece, fr: number, fc: number, tr: number, tc: number): boolean {
  const dr = tr - fr, dc = tc - fc;
  const ar = Math.abs(dr), ac = Math.abs(dc);
  switch (p.type) {
    case "P": {
      const dir = p.color === "w" ? -1 : 1;
      return dr === dir && ac === 1;
    }
    case "N": return (ar === 2 && ac === 1) || (ar === 1 && ac === 2);
    case "K": return ar <= 1 && ac <= 1 && (ar + ac > 0);
    case "B": if (ar !== ac || ar === 0) return false; return isClear(b, fr, fc, tr, tc);
    case "R": if (dr !== 0 && dc !== 0) return false; return isClear(b, fr, fc, tr, tc);
    case "Q":
      if (dr !== 0 && dc !== 0 && ar !== ac) return false;
      return isClear(b, fr, fc, tr, tc);
  }
}

function isClear(b: Board, fr: number, fc: number, tr: number, tc: number): boolean {
  const rs = tr === fr ? 0 : tr > fr ? 1 : -1;
  const cs = tc === fc ? 0 : tc > fc ? 1 : -1;
  let r = fr + rs, c = fc + cs;
  while (r !== tr || c !== tc) {
    if (b[r][c]) return false;
    r += rs; c += cs;
  }
  return true;
}

function inCheck(b: Board, color: Color): boolean {
  const kp = findKing(b, color);
  return kp ? isAttacked(b, kp[0], kp[1], opp(color)) : false;
}

// Generate all pseudo-legal moves for a piece (correct movement patterns)
function pieceMoves(
  b: Board, r: number, c: number,
  ep: [number, number] | null,
  cr: CastlingRights
): Move[] {
  const p = b[r][c];
  if (!p) return [];
  const moves: Move[] = [];
  const color = p.color;

  const push = (tr: number, tc: number, extra?: Partial<Move>) => {
    if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return;
    const target = b[tr][tc];
    if (target?.color === color) return; // can't capture own piece
    moves.push({ from: [r, c], to: [tr, tc], captured: target ?? undefined, ...extra });
  };

  const slide = (drs: number[], dcs: number[]) => {
    for (let i = 0; i < drs.length; i++) {
      let tr = r + drs[i], tc = c + dcs[i];
      while (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
        const t = b[tr][tc];
        if (t?.color === color) break;
        push(tr, tc);
        if (t) break; // blocked after capture
        tr += drs[i]; tc += dcs[i];
      }
    }
  };

  switch (p.type) {
    case "P": {
      const dir = color === "w" ? -1 : 1;
      const startRow = color === "w" ? 6 : 1;
      const promRow = color === "w" ? 0 : 7;
      // forward
      const tr1 = r + dir;
      if (tr1 >= 0 && tr1 < 8 && !b[tr1][c]) {
        if (tr1 === promRow) {
          for (const pt of ["Q", "R", "B", "N"] as PieceType[])
            moves.push({ from: [r, c], to: [tr1, c], promotion: pt });
        } else {
          moves.push({ from: [r, c], to: [tr1, c] });
          // double push
          const tr2 = r + dir * 2;
          if (r === startRow && !b[tr2][c])
            moves.push({ from: [r, c], to: [tr2, c] });
        }
      }
      // diagonal captures
      for (const dc of [-1, 1]) {
        const tc = c + dc;
        if (tc < 0 || tc > 7) continue;
        const target = b[tr1][tc];
        if (target && target.color !== color) {
          if (tr1 === promRow) {
            for (const pt of ["Q", "R", "B", "N"] as PieceType[])
              moves.push({ from: [r, c], to: [tr1, tc], promotion: pt, captured: target });
          } else {
            moves.push({ from: [r, c], to: [tr1, tc], captured: target });
          }
        }
        // en passant
        if (ep && tr1 === ep[0] && tc === ep[1]) {
          moves.push({ from: [r, c], to: [tr1, tc], enPassant: true });
        }
      }
      break;
    }
    case "N": {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])
        push(r + dr, c + dc);
      break;
    }
    case "B": slide([-1, -1, 1, 1], [-1, 1, -1, 1]); break;
    case "R": slide([-1, 1, 0, 0], [0, 0, -1, 1]); break;
    case "Q": slide([-1, 1, 0, 0, -1, -1, 1, 1], [0, 0, -1, 1, -1, 1, -1, 1]); break;
    case "K": {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]])
        push(r + dr, c + dc);
      // Castling
      if (color === "w" && r === 7 && c === 4) {
        if (cr.wK && !b[7][5] && !b[7][6] && b[7][7]?.type === "R"
          && !inCheck(b, "w") && !isAttacked(b, 7, 5, "b") && !isAttacked(b, 7, 6, "b"))
          moves.push({ from: [r, c], to: [7, 6], castle: "K" });
        if (cr.wQ && !b[7][3] && !b[7][2] && !b[7][1] && b[7][0]?.type === "R"
          && !inCheck(b, "w") && !isAttacked(b, 7, 3, "b") && !isAttacked(b, 7, 2, "b"))
          moves.push({ from: [r, c], to: [7, 2], castle: "Q" });
      }
      if (color === "b" && r === 0 && c === 4) {
        if (cr.bK && !b[0][5] && !b[0][6] && b[0][7]?.type === "R"
          && !inCheck(b, "b") && !isAttacked(b, 0, 5, "w") && !isAttacked(b, 0, 6, "w"))
          moves.push({ from: [r, c], to: [0, 6], castle: "K" });
        if (cr.bQ && !b[0][3] && !b[0][2] && !b[0][1] && b[0][0]?.type === "R"
          && !inCheck(b, "b") && !isAttacked(b, 0, 3, "w") && !isAttacked(b, 0, 2, "w"))
          moves.push({ from: [r, c], to: [0, 2], castle: "Q" });
      }
      break;
    }
  }
  return moves;
}

// Filter moves that leave own king in check
function legalMoves(b: Board, r: number, c: number, ep: [number, number] | null, cr: CastlingRights): Move[] {
  const color = b[r][c]?.color;
  if (!color) return [];
  return pieceMoves(b, r, c, ep, cr).filter(m => {
    const nb = applyMove(b, m);
    return !inCheck(nb, color);
  });
}

function allLegalMoves(b: Board, color: Color, ep: [number, number] | null, cr: CastlingRights): Move[] {
  const moves: Move[] = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (b[r][c]?.color === color)
        moves.push(...legalMoves(b, r, c, ep, cr));
  return moves;
}

function applyMove(b: Board, m: Move): Board {
  const nb = cloneBoard(b);
  const [fr, fc] = m.from;
  const [tr, tc] = m.to;
  const piece = nb[fr][fc]!;
  nb[tr][tc] = m.promotion ? { type: m.promotion, color: piece.color } : piece;
  nb[fr][fc] = null;
  if (m.castle === "K") {
    if (tr === 7) { nb[7][5] = nb[7][7]; nb[7][7] = null; }
    else { nb[0][5] = nb[0][7]; nb[0][7] = null; }
  }
  if (m.castle === "Q") {
    if (tr === 7) { nb[7][3] = nb[7][0]; nb[7][0] = null; }
    else { nb[0][3] = nb[0][0]; nb[0][0] = null; }
  }
  if (m.enPassant) {
    const captureRow = piece.color === "w" ? tr + 1 : tr - 1;
    nb[captureRow][tc] = null;
  }
  return nb;
}

// ─── AI ───────────────────────────────────────────────────────────────────────
const PIECE_VALUE: Record<PieceType, number> = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

// Piece-square tables (white's perspective, mirror for black)
const PST: Record<PieceType, number[]> = {
  P: [0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
  N: [-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
  B: [-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
  R: [0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
  Q: Array(64).fill(0),
  K: [-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,-5,-5,-5,-5,20,20,20,30,10,0,0,10,30,20],
};

function evalBoard(b: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = b[r][c];
      if (!p) continue;
      const idx = p.color === "w" ? r * 8 + c : (7 - r) * 8 + c;
      const val = PIECE_VALUE[p.type] + (PST[p.type][idx] || 0);
      score += p.color === "w" ? val : -val;
    }
  }
  return score;
}

function minimax(
  b: Board, depth: number, alpha: number, beta: number, maxing: boolean,
  ep: [number, number] | null, cr: CastlingRights
): number {
  if (depth === 0) return evalBoard(b);
  const color: Color = maxing ? "b" : "w";
  const moves = allLegalMoves(b, color, ep, cr);
  if (moves.length === 0) {
    return inCheck(b, color) ? (maxing ? -99999 : 99999) : 0;
  }
  // MVV-LVA sort: captures first
  moves.sort((a, b) => {
    const av = a.captured ? PIECE_VALUE[a.captured.type] : 0;
    const bv = b.captured ? PIECE_VALUE[b.captured.type] : 0;
    return bv - av;
  });

  if (maxing) {
    let best = -Infinity;
    for (const m of moves) {
      const nb = applyMove(b, m);
      const s = minimax(nb, depth - 1, alpha, beta, false, null, cr);
      best = Math.max(best, s);
      alpha = Math.max(alpha, s);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const nb = applyMove(b, m);
      const s = minimax(nb, depth - 1, alpha, beta, true, null, cr);
      best = Math.min(best, s);
      beta = Math.min(beta, s);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(b: Board, depth: number, ep: [number, number] | null, cr: CastlingRights, randomChance = 0): Move | null {
  const moves = allLegalMoves(b, "b", ep, cr);
  if (!moves.length) return null;
  if (randomChance > 0 && Math.random() < randomChance) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  moves.sort((a, bm) => {
    const av = a.captured ? PIECE_VALUE[a.captured.type] : 0;
    const bv = bm.captured ? PIECE_VALUE[bm.captured.type] : 0;
    return bv - av;
  });
  let bestScore = -Infinity;
  let bestMove = moves[0];
  for (const m of moves) {
    const nb = applyMove(b, m);
    const s = minimax(nb, depth - 1, -Infinity, Infinity, false, null, cr);
    if (s > bestScore) { bestScore = s; bestMove = m; }
  }
  return bestMove;
}

const DIFFICULTY = [
  { key: 1 as const, label: "입문", depth: 1, random: 0.4 },
  { key: 2 as const, label: "초급", depth: 2, random: 0.15 },
  { key: 3 as const, label: "중급", depth: 3, random: 0 },
  { key: 4 as const, label: "고급", depth: 3, random: 0 },
  { key: 5 as const, label: "고수", depth: 4, random: 0 },
];

// Algebraic notation helper
function toAlgNotation(b: Board, m: Move): string {
  const p = b[m.from[0]][m.from[1]];
  if (!p) return "";
  if (m.castle) return m.castle === "K" ? "O-O" : "O-O-O";
  const files = "abcdefgh";
  const toFile = files[m.to[1]];
  const toRank = 8 - m.to[0];
  const fromFile = files[m.from[1]];
  let notation = "";
  if (p.type === "P") {
    notation = m.captured || m.enPassant ? `${fromFile}x${toFile}${toRank}` : `${toFile}${toRank}`;
  } else {
    const pfx = p.type;
    notation = m.captured ? `${pfx}x${toFile}${toRank}` : `${pfx}${toFile}${toRank}`;
  }
  if (m.promotion) notation += "=" + m.promotion;
  return notation;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ChessGame({ inModal }: { inModal?: boolean } = {}) {
  const [board, setBoard] = useState<Board>(initBoard);
  const [turn, setTurn] = useState<Color>("w");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [ep, setEp] = useState<[number, number] | null>(null); // en passant target
  const [castling, setCastling] = useState<CastlingRights>({ wK: true, wQ: true, bK: true, bQ: true });
  const [captured, setCaptured] = useState<{ byW: Piece[]; byB: Piece[] }>({ byW: [], byB: [] });
  const [history, setHistory] = useState<string[]>([]);
  const [flashCell, setFlashCell] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<[[number, number], [number, number]] | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<1|2|3|4|5>(2);
  const [promotionPending, setPromotionPending] = useState<{ move: Move } | null>(null);
  const [gameOver, setGameOver] = useState<{ result: "win" | "loss" | "draw"; msg: string } | null>(null);

  const boardRef = useRef(board);
  const epRef = useRef(ep);
  const castlingRef = useRef(castling);
  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { epRef.current = ep; }, [ep]);
  useEffect(() => { castlingRef.current = castling; }, [castling]);

  const legalMovesForSelected = useMemo(
    () => selected ? legalMoves(board, selected[0], selected[1], ep, castling) : [],
    [board, selected, ep, castling]
  );

  const kingInCheck = useMemo(() => inCheck(board, turn), [board, turn]);
  const kingPos = useMemo(() => findKing(board, turn), [board, turn]);

  function executeMove(b: Board, m: Move) {
    const newBoard = applyMove(b, m);
    const piece = b[m.from[0]][m.from[1]]!;

    // Update castling rights
    const newCr = { ...castlingRef.current };
    if (piece.type === "K") {
      if (piece.color === "w") { newCr.wK = false; newCr.wQ = false; }
      else { newCr.bK = false; newCr.bQ = false; }
    }
    if (piece.type === "R") {
      if (m.from[0] === 7 && m.from[1] === 7) newCr.wK = false;
      if (m.from[0] === 7 && m.from[1] === 0) newCr.wQ = false;
      if (m.from[0] === 0 && m.from[1] === 7) newCr.bK = false;
      if (m.from[0] === 0 && m.from[1] === 0) newCr.bQ = false;
    }

    // En passant target
    let newEp: [number, number] | null = null;
    if (piece.type === "P" && Math.abs(m.to[0] - m.from[0]) === 2) {
      newEp = [(m.from[0] + m.to[0]) / 2, m.to[1]];
    }

    // Flash captured
    if (m.captured || m.enPassant) {
      const fKey = m.enPassant
        ? `${piece.color === "w" ? m.to[0] + 1 : m.to[0] - 1},${m.to[1]}`
        : `${m.to[0]},${m.to[1]}`;
      setFlashCell(fKey);
      setTimeout(() => setFlashCell(null), 600);
    }

    // Captured pieces
    if (m.captured) {
      setCaptured(prev =>
        piece.color === "w"
          ? { ...prev, byW: [...prev.byW, m.captured!] }
          : { ...prev, byB: [...prev.byB, m.captured!] }
      );
    }
    if (m.enPassant) {
      const epPiece: Piece = { type: "P", color: opp(piece.color) };
      setCaptured(prev =>
        piece.color === "w"
          ? { ...prev, byW: [...prev.byW, epPiece] }
          : { ...prev, byB: [...prev.byB, epPiece] }
      );
    }

    const notation = toAlgNotation(b, m);
    const nextTurn = opp(piece.color);
    const nextMoves = allLegalMoves(newBoard, nextTurn, newEp, newCr);

    // Check for check/mate/stalemate notation suffix
    let suffix = "";
    if (inCheck(newBoard, nextTurn)) {
      suffix = nextMoves.length === 0 ? "#" : "+";
    }

    setBoard(newBoard);
    setCastling(newCr);
    setEp(newEp);
    setLastMove([m.from, m.to]);
    setHistory(prev => [...prev, notation + suffix]);
    setSelected(null);

    if (nextMoves.length === 0) {
      if (inCheck(newBoard, nextTurn)) {
        setGameOver({
          result: piece.color === "w" ? "win" : "loss",
          msg: piece.color === "w" ? "체크메이트! 당신이 이겼습니다! 🎉" : "체크메이트! AI가 이겼습니다."
        });
      } else {
        setGameOver({ result: "draw", msg: "스테일메이트! 무승부입니다." });
      }
    } else {
      setTurn(nextTurn);
    }
  }

  const handleSquareClick = useCallback((r: number, c: number) => {
    if (turn !== "w" || isThinking || gameOver || promotionPending) return;

    if (selected === null) {
      if (board[r][c]?.color === "w") setSelected([r, c]);
    } else {
      const move = legalMovesForSelected.find(m => m.to[0] === r && m.to[1] === c);
      if (move) {
        if (move.promotion) {
          // Show promotion picker
          setPromotionPending({ move });
          return;
        }
        executeMove(board, move);
      } else if (board[r][c]?.color === "w") {
        setSelected([r, c]);
      } else {
        setSelected(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isThinking, gameOver, promotionPending, selected, board, legalMovesForSelected]);

  function handlePromotion(pt: PieceType) {
    if (!promotionPending) return;
    const m = { ...promotionPending.move, promotion: pt };
    setPromotionPending(null);
    executeMove(board, m);
  }

  // AI turn
  useEffect(() => {
    if (turn !== "b" || isThinking || gameOver) return;
    setIsThinking(true);
    const diff = DIFFICULTY.find(d => d.key === difficulty)!;
    const id = setTimeout(() => {
      const move = getBestMove(boardRef.current, diff.depth, epRef.current, castlingRef.current, diff.random);
      if (move) {
        executeMove(boardRef.current, move);
      } else {
        // No moves — game over handled inside executeMove if applicable; fallback
        setTurn("w");
      }
      setIsThinking(false);
    }, 300);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, difficulty, gameOver]);

  function resetGame() {
    setBoard(initBoard());
    setTurn("w");
    setSelected(null);
    setEp(null);
    setCastling({ wK: true, wQ: true, bK: true, bQ: true });
    setCaptured({ byW: [], byB: [] });
    setHistory([]);
    setFlashCell(null);
    setLastMove(null);
    setIsThinking(false);
    setPromotionPending(null);
    setGameOver(null);
  }

  const diff = DIFFICULTY.find(d => d.key === difficulty)!;
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  // Material advantage
  const wMat = captured.byW.reduce((s, p) => s + PIECE_VALUE[p.type], 0);
  const bMat = captured.byB.reduce((s, p) => s + PIECE_VALUE[p.type], 0);
  const advantage = wMat - bMat;

  return (
    <GameFrame
      title="Chess"
      subtitle="AI와 대결하는 풀 룰 체스 게임. 캐슬링·앙파상·프로모션 완전 지원"
      badges={["전략", "AI", "1vs1"]}
      stats={[
        { label: "난이도", value: diff.label },
        { label: "차례", value: turn === "w" ? "⬜ 당신" : isThinking ? "🤔 AI..." : "⬛ AI" },
        { label: "재료 우위", value: advantage > 0 ? `+${advantage}` : advantage < 0 ? `${advantage}` : "=" },
      ]}
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            {DIFFICULTY.map(d => (
              <Button
                key={d.key}
                size="sm"
                variant={difficulty === d.key ? "default" : "outline"}
                className={cn("rounded-full text-xs px-3", difficulty === d.key && "bg-amber-600 hover:bg-amber-700")}
                onClick={() => setDifficulty(d.key)}
              >
                {d.label}
              </Button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="rounded-full" onClick={resetGame}>
            새 게임
          </Button>
          {kingInCheck && !gameOver && (
            <span className="text-sm font-semibold text-red-400 animate-pulse">⚠️ 체크!</span>
          )}
          {gameOver && (
            <span className="text-sm font-semibold text-[var(--neon-magenta)]">{gameOver.msg}</span>
          )}
        </div>
      }
      inModal={inModal}
      aside={
        <div className="space-y-3">
          {/* Move history */}
          <div className="rounded-2xl border border-[var(--neon-cyan)]/20 bg-[var(--arcade-card)] p-4">
            <h3 className="mb-2 text-sm font-semibold text-[var(--neon-cyan)]">이동 기록</h3>
            <div className="max-h-48 overflow-y-auto font-mono text-xs text-slate-400 space-y-0.5">
              {history.length === 0
                ? <p className="text-slate-400 italic">게임을 시작하세요</p>
                : history.reduce<React.ReactNode[]>((acc, mv, i) => {
                    if (i % 2 === 0) acc.push(
                      <div key={i} className="flex gap-2">
                        <span className="text-slate-400 w-6">{Math.floor(i / 2) + 1}.</span>
                        <span className="w-12">{mv}</span>
                        <span className="w-12">{history[i + 1] ?? ""}</span>
                      </div>
                    );
                    return acc;
                  }, [])
              }
            </div>
          </div>
          {/* Captured pieces */}
          <div className="rounded-2xl border border-[var(--neon-cyan)]/20 bg-[var(--arcade-card)] p-4 text-xs">
            <div className="space-y-2">
              <div>
                <span className="text-slate-400">당신이 잡음:</span>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {captured.byW.map((p, i) => (
                    <span key={i} className="inline-block w-5 h-5">
                      <PieceSVG type={p.type} color="b" />
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400">AI가 잡음:</span>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {captured.byB.map((p, i) => (
                    <span key={i} className="inline-block w-5 h-5">
                      <PieceSVG type={p.type} color="w" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <GameViewport aspectRatio={1}>
      <div className="relative h-full w-full">
        {/* Promotion dialog */}
        {promotionPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-xl">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <p className="text-sm font-semibold text-slate-700 mb-4 text-center">프로모션 기물 선택</p>
              <div className="flex gap-3">
                {(["Q", "R", "B", "N"] as PieceType[]).map(pt => (
                  <button
                    key={pt}
                    onClick={() => handlePromotion(pt)}
                    className="w-14 h-14 rounded-xl bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 transition-colors p-1"
                  >
                    <PieceSVG type={pt} color="w" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center space-y-4">
              <div className="text-5xl">{gameOver.result === "win" ? "🏆" : gameOver.result === "loss" ? "😞" : "🤝"}</div>
              <p className="text-lg font-bold text-slate-900">{gameOver.msg}</p>
              <Button onClick={resetGame} className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                다시 플레이
              </Button>
            </div>
          </div>
        )}

        {/* Board */}
        <div className="mx-auto w-full">
          {/* Column labels (a-h) top */}
          <div className="grid grid-cols-[20px_repeat(8,1fr)_20px] mb-0.5 pl-5">
            {files.map(f => (
              <div key={f} className="text-center text-[10px] font-semibold text-slate-400">{f}</div>
            ))}
          </div>

          <div className="grid grid-cols-[20px_repeat(8,1fr)_20px]">
            {Array.from({ length: 8 }, (_, rowIndex) => (
              <>
                {/* Row label left */}
                <div key={`l${rowIndex}`} className="flex items-center justify-center text-[10px] font-semibold text-slate-400">
                  {8 - rowIndex}
                </div>

                {/* Squares */}
                {Array.from({ length: 8 }, (_, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0;
                  const isSelected = selected?.[0] === rowIndex && selected?.[1] === colIndex;
                  const isLegal = legalMovesForSelected.some(m => m.to[0] === rowIndex && m.to[1] === colIndex);
                  const isLastFrom = lastMove?.[0][0] === rowIndex && lastMove?.[0][1] === colIndex;
                  const isLastTo = lastMove?.[1][0] === rowIndex && lastMove?.[1][1] === colIndex;
                  const isKingCheck = kingInCheck && kingPos?.[0] === rowIndex && kingPos?.[1] === colIndex;
                  const isFlash = flashCell === `${rowIndex},${colIndex}`;
                  const cellPiece = board[rowIndex][colIndex];
                  const isCapturableTarget = isLegal && !!cellPiece;

                  let bg = isLight ? "#F0D9B5" : "#B58863";
                  if (isSelected) bg = "#7fc97a";
                  else if (isLastFrom || isLastTo) bg = isLight ? "#cdd16f" : "#aaa23a";
                  if (isKingCheck) bg = "#e74c3c";

                  return (
                    <button
                      key={colIndex}
                      className={cn(
                        "aspect-square relative flex items-center justify-center cursor-pointer",
                        "transition-all duration-100",
                        isThinking && "cursor-wait",
                        isFlash && "animate-battle-flash"
                      )}
                      style={{ backgroundColor: bg }}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {/* Legal move indicator */}
                      {isLegal && !isCapturableTarget && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-[30%] h-[30%] rounded-full bg-black/20" />
                        </div>
                      )}
                      {/* Capturable piece ring */}
                      {isCapturableTarget && (
                        <div className="absolute inset-0 rounded-[2px] ring-[3px] ring-inset ring-black/35 pointer-events-none" />
                      )}
                      {/* Piece */}
                      {cellPiece && (
                        <div className={cn(
                          "absolute inset-[8%] pointer-events-none transition-transform duration-100",
                          isSelected && "scale-110"
                        )}>
                          <PieceSVG type={cellPiece.type} color={cellPiece.color} />
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Row label right */}
                <div key={`r${rowIndex}`} className="flex items-center justify-center text-[10px] font-semibold text-slate-400">
                  {8 - rowIndex}
                </div>
              </>
            ))}
          </div>

          {/* Column labels bottom */}
          <div className="grid grid-cols-[20px_repeat(8,1fr)_20px] mt-0.5 pl-5">
            {files.map(f => (
              <div key={f} className="text-center text-[10px] font-semibold text-slate-400">{f}</div>
            ))}
          </div>
        </div>

        {/* AI thinking indicator */}
        {isThinking && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            AI가 생각 중...
          </div>
        )}
      </div>
      </GameViewport>
    </GameFrame>
  );
}
