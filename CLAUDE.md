# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development server (hot reload on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint with ESLint
npm run lint

# Deploy preview to Vercel
npm run deploy:preview

# Deploy production to Vercel
npm run deploy:prod
```

## Architecture Overview

**FunFUnGames** is a Next.js 16 mini-game portal with 4 playable games: Tetris, 2048, Snake, and Memory Match.

### Core Structure

- **Game Catalog System**: `src/lib/game-data.ts` defines the `GameItem` type and `gameCatalog` array. Each game has metadata (title, description, difficulty, tags, hints, instructions).
- **Routing**: Two-level routing for games:
  - `/games` — catalog page listing all games
  - `/games/[slug]` — individual game pages (slug from game catalog)
- **Shared UI Layer**: `src/components/ui/` contains shadcn/ui components (Button, Badge, Card).
- **Game Implementation**: `src/components/games/` contains individual game components (`game-tetris.tsx`, `game-2048.tsx`, `game-snake.tsx`, `game-memory-match.tsx`).
- **Layout Wrapper**: `GameFrame` (`src/components/games/game-frame.tsx`) provides consistent card-based UI with title, badges, stats, and sidebar for all games.

### Key Files

- `src/app/page.tsx` — Homepage displaying game catalog with Card components
- `src/app/games/[slug]/page.tsx` — Dynamic game detail page
- `src/app/layout.tsx` — Root layout with metadata, fonts (Geist), and SiteHeader
- `src/components/site-header.tsx` — Navigation header
- `src/app/globals.css` — Tailwind CSS + custom game panel styles (`.fun-panel`)
- `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx` — Social media preview images

## Development Notes

### Next.js 16 Compatibility

This project uses Next.js 16.2.1 with React 19.2.4 — newer than typical training data. Review `node_modules/next/dist/docs/` for API changes before implementing new features (especially around rendering, hydration, or server components).

### Styling & UI

- **Tailwind CSS v4** with custom PostCSS — check config in `tailwindcss` package settings
- **Utility Function**: `cn()` in `src/lib/utils.ts` merges class names using `clsx` and `tailwind-merge`
- **Game Panel Style**: `.fun-panel` class in `globals.css` provides consistent card styling for all games
- All game pages use `GameFrame` wrapper for uniform layout (title, badges, stats section, main gameplay area, optional sidebar)

### Game Implementation Pattern

Each game component (e.g., `game-tetris.tsx`):
1. Uses `"use client"` directive (client-side interactive game)
2. Accepts game metadata via props
3. Manages game state (score, board, etc.) with `useState`/`useReducer`
4. Renders into a `<canvas>` or game-specific DOM structure
5. Passes stats, controls, and game UI to `GameFrame`

Example stats: `{ label: "Score", value: 0 }`, `{ label: "Level", value: 1 }`

### Path Aliases

`tsconfig.json` defines `@/*` → `./src/*` for imports. Use `@/components/...`, `@/lib/...` throughout.

## Deployment

- **Hosting**: Vercel (via `vercel` CLI commands in npm scripts)
- **Environment**: Vercel token stored in `정보.txt` (ignored in .gitignore — never commit secrets)
- **Base URL**: `https://funfungames.vercel.app`
- **Metadata**: Open Graph and Twitter Card images generated dynamically

## Important Notes

1. **Game Data Updates**: Add new games by extending `gameCatalog` in `src/lib/game-data.ts` with new `GameItem` objects and matching components in `src/components/games/`.
2. **Korean Content**: Project uses Korean descriptions and hints. Maintain consistency when adding content.
3. **Responsive Design**: Games use Tailwind's responsive grid (e.g., `lg:grid-cols-[1fr_320px]` in `GameFrame`). Test on mobile and desktop.
4. **Type Safety**: Strict TypeScript mode enabled. Always define types for props and state.

## AGENTS.md Note

This project uses Next.js 16.2.1 with breaking changes from earlier versions. See `AGENTS.md` for reminders about consulting `node_modules/next/dist/docs/` before writing code.
