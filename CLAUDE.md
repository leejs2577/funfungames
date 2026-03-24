# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 리포지토리의 코드를 다룰 때 참고하는 가이드입니다.

---

## 🚀 빠른 시작 명령어

모든 명령어는 프로젝트 루트 디렉토리에서 실행합니다:

```bash
# 개발 서버 실행 (http://localhost:3000에서 자동 새로고침)
npm run dev

# 프로덕션용 빌드 생성
npm run build

# 프로덕션 빌드를 로컬에서 실행 (배포 전 테스트용)
npm start

# ESLint로 코드 검사 (문법 및 스타일 체크)
npm run lint

# Vercel에 미리보기 버전 배포
npm run deploy:preview

# Vercel에 프로덕션 버전 배포
npm run deploy:prod
```

### 개발 중 자주 사용하는 명령어

```bash
# 개발 서버 실행 후 파일 수정 시 자동 새로고침
npm run dev

# 특정 오류 수정 후 린트 검사
npm run lint

# 배포 전 프로덕션 빌드 확인
npm run build && npm start
```

---

## 🏗️ 프로젝트 전체 아키텍처

### 프로젝트 개요

**FunFUnGames**는 게임 카탈로그 시스템으로 여러 게임을 동적으로 렌더링하는 웹 애플리케이션입니다.

```
사용자가 홈페이지 방문
    ↓
게임 카탈로그 표시 (게임 데이터 from game-data.ts)
    ↓
게임 카드 클릭
    ↓
동적 라우트 [slug]로 게임 페이지 로드
    ↓
GameFrame 래퍼로 일관된 UI 제공
    ↓
해당 게임 컴포넌트 렌더링
```

### 핵심 구조 설명

#### 1️⃣ **게임 카탈로그 시스템** (`src/lib/game-data.ts`)

모든 게임의 메타데이터를 중앙에서 관리합니다:

```typescript
export type GameItem = {
  slug: string                    // URL에 사용되는 고유 식별자
  title: string                   // 게임 이름
  tagline: string                 // 한 줄 설명
  description: string             // 상세 설명
  category: string                // 게임 분류 (Arcade, Puzzle 등)
  difficulty: string              // 난이도 (Easy, Medium 등)
  emoji: string                   // 게임 아이콘
  tint: string                    // Tailwind 그래디언트 색상
  tags: string[]                  // 게임 특징 태그
  instructions: string            // 게임 방법 설명
  hints: string[]                 // 팁 목록
}
```

**장점**:
- 게임 데이터와 UI 분리
- 새 게임 추가 시 데이터만 추가하면 자동 반영
- 모든 페이지에서 일관된 메타데이터 사용

#### 2️⃣ **라우팅 구조** (App Router)

Next.js 16의 App Router를 사용합니다:

```
/                          → 홈페이지 (게임 카탈로그)
  src/app/page.tsx

/games                     → 게임 목록 페이지
  src/app/games/page.tsx

/games/tetris              → 테트리스 게임 페이지
/games/2048               → 2048 게임 페이지
/games/snake              → 스네이크 게임 페이지
/games/memory-match       → 메모리 매치 게임 페이지
  src/app/games/[slug]/page.tsx  (동적 라우트)
```

#### 3️⃣ **공유 UI 컴포넌트** (`src/components/ui/`)

shadcn/ui 기반의 재사용 가능한 컴포넌트들:

- **Button**: 클릭 가능한 버튼
- **Card**: 정보를 담는 카드 레이아웃
- **Badge**: 태그나 상태를 표시하는 배지

이 컴포넌트들은 모든 페이지에서 일관된 스타일을 제공합니다.

#### 4️⃣ **게임 구현** (`src/components/games/`)

각 게임별 컴포넌트:

```
game-tetris.tsx          → 테트리스 로직 및 렌더링
game-2048.tsx            → 2048 로직 및 렌더링
game-snake.tsx           → 스네이크 로직 및 렌더링
game-memory-match.tsx    → 메모리 매치 로직 및 렌더링
game-frame.tsx           → 모든 게임의 공통 레이아웃 래퍼 ⭐
```

#### 5️⃣ **GameFrame 래퍼** (`src/components/games/game-frame.tsx`)

모든 게임이 일관된 UI를 제공하도록 하는 컴포넌트입니다:

```typescript
// 모든 게임이 이렇게 사용합니다
<GameFrame
  title="게임 이름"
  subtitle="게임 설명"
  badges={['태그1', '태그2']}        // 게임 특징
  stats={[
    { label: 'Score', value: 100 },
    { label: 'Level', value: 2 }
  ]}                                   // 게임 통계
  controls={<button>재시작</button>}  // 게임 제어 버튼
  aside={<div>추가 정보</div>}        // 선택적 사이드 패널
>
  {/* 게임 실제 콘텐츠 */}
</GameFrame>
```

**이점**:
- 코드 중복 제거
- UI 일관성 유지
- 새 게임 추가 시 더 간단해짐

---

## 📄 주요 파일 설명

### 페이지 및 레이아웃

| 파일 | 역할 | 주요 내용 |
|------|------|----------|
| `src/app/layout.tsx` | 루트 레이아웃 | 메타데이터, 폰트 로드, SiteHeader, 전체 레이아웃 |
| `src/app/page.tsx` | 홈페이지 | 게임 카탈로그 표시, Card 컴포넌트 사용 |
| `src/app/games/page.tsx` | 게임 목록 페이지 | 모든 게임 목록 표시 |
| `src/app/games/[slug]/page.tsx` | 동적 게임 페이지 | 선택한 게임을 `game-data.ts`에서 찾아 표시 |

### 스타일 및 설정

| 파일 | 역할 |
|------|------|
| `src/app/globals.css` | 전역 스타일, `.fun-panel` 클래스 정의 |
| `tsconfig.json` | TypeScript 설정, 경로 별칭 (`@/*` → `./src/*`) |
| `next.config.ts` | Next.js 설정 |

### 메타데이터 이미지

| 파일 | 역할 |
|------|------|
| `src/app/opengraph-image.tsx` | SNS 공유 시 보이는 이미지 |
| `src/app/twitter-image.tsx` | Twitter/X 공유 시 보이는 이미지 |

---

## 🎨 개발 가이드

### 1. TypeScript 경로 별칭 사용

```typescript
// ✅ 권장: 경로 별칭 사용 (깔끔하고 읽기 쉬움)
import { Button } from '@/components/ui/button'
import { gameCatalog } from '@/lib/game-data'
import { cn } from '@/lib/utils'

// ❌ 비권장: 상대 경로 (복잡하고 리팩토링 어려움)
import { Button } from '../../../components/ui/button'
```

### 2. 클래스명 병합 유틸리티

```typescript
import { cn } from '@/lib/utils'

// 동적 클래스 조합
<button className={cn(
  'px-4 py-2 rounded',           // 기본 클래스
  isActive && 'bg-blue-500',      // 조건부 클래스
  disabled && 'opacity-50'
)} />
```

### 3. 게임 컴포넌트 작성 패턴

모든 게임은 이 패턴을 따릅니다:

```typescript
'use client' // ← 중요! 클라이언트 컴포넌트로 지정

import { GameItem } from '@/lib/game-data'
import { GameFrame } from './game-frame'
import { useState } from 'react'

export function GameNewGame({ game }: { game: GameItem }) {
  // 게임 상태 관리
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)

  // 게임 로직 함수들
  const handleStart = () => {
    // 게임 시작 로직
  }

  // GameFrame으로 감싸기
  return (
    <GameFrame
      title={game.title}
      subtitle={game.description}
      badges={game.tags}
      stats={[
        { label: 'Score', value: score },
        { label: 'Level', value: level }
      ]}
      controls={
        <button onClick={handleStart}>
          시작
        </button>
      }
    >
      {/* 게임 UI 렌더링 */}
      <div className="fun-panel">
        {/* 게임 보드, 캔버스 등 */}
      </div>
    </GameFrame>
  )
}
```

### 4. 새로운 게임 추가하기

**단계 1**: `src/lib/game-data.ts`에 게임 데이터 추가

```typescript
{
  slug: "flappy-bird",
  title: "Flappy Bird",
  tagline: "한 번의 탭으로 나는 새",
  description: "새를 조종하여 파이프 사이를 통과하세요.",
  category: "Arcade",
  difficulty: "Medium",
  emoji: "🐦",
  tint: "from-blue-100 via-white to-cyan-50",
  tags: ["arcade", "tap", "reaction"],
  instructions: "스페이스바를 눌러 새를 날립니다.",
  hints: [
    "일정한 타이밍으로 탭하면 더 안정적입니다.",
    "초반에는 천천히 진행하며 감각을 익히세요."
  ]
}
```

**단계 2**: `src/components/games/game-flappy-bird.tsx` 파일 생성

```typescript
'use client'

import { GameItem } from '@/lib/game-data'
import { GameFrame } from './game-frame'
import { useState } from 'react'

export function GameFlappyBird({ game }: { game: GameItem }) {
  const [score, setScore] = useState(0)

  return (
    <GameFrame
      title={game.title}
      subtitle={game.description}
      badges={game.tags}
      stats={[{ label: 'Score', value: score }]}
      controls={<button>시작</button>}
    >
      {/* Flappy Bird 게임 구현 */}
    </GameFrame>
  )
}
```

**단계 3**: 동적 라우트에서 자동으로 렌더링됨!

---

## 🎨 스타일 및 디자인

### Tailwind CSS v4 설정

이 프로젝트는 Tailwind CSS v4를 사용합니다:

```typescript
// 클래스명은 Tailwind 공식 문서 참고
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* 모바일: 1열, 데스크톱: 3열 */}
</div>
```

### 게임 패널 스타일 (`.fun-panel`)

```css
/* globals.css 에 정의됨 */
.fun-panel {
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 16px 40px rgba(148, 163, 184, 0.12);
  border-radius: 12px;
}
```

게임 콘텐츠는 이 클래스로 감싸면 일관된 디자인이 적용됩니다.

### 색상 그래디언트

각 게임마다 고유한 색상 그래디언트가 있습니다:

```typescript
// game-data.ts
tint: "from-sky-100 via-white to-cyan-50"  // 테트리스
tint: "from-amber-100 via-white to-orange-50"  // 2048
tint: "from-emerald-100 via-white to-lime-50"  // 스네이크
tint: "from-rose-100 via-white to-fuchsia-50"  // 메모리 매치
```

---

## 📱 반응형 디자인

게임은 모바일, 태블릿, 데스크톱 모두에서 작동해야 합니다:

```typescript
// GameFrame 내부
<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
  {/*
    - 모바일: 게임이 전체 너비
    - 데스크톱: 게임 + 320px 사이드 패널
  */}
</div>
```

### 테스트 방법

```bash
npm run dev  # 개발 서버 실행

# 브라우저 개발자 도구에서
# 1. F12 또는 우클릭 → 검사
# 2. 상단 기기 아이콘 클릭
# 3. iPhone, iPad, Desktop 등 다양한 크기 확인
```

---

## 🚀 배포 및 환경

### Vercel 배포

```bash
# 미리보기 배포 (테스트용)
npm run deploy:preview

# 프로덕션 배포
npm run deploy:prod
```

### 환경 변수

배포에 필요한 환경 변수:

- `VERCEL_TOKEN`: Vercel 배포 인증 토큰
  - 파일: `정보.txt`
  - ⚠️ 절대 커밋하면 안 됨! (`.gitignore`에 추가됨)

### 배포 주소

- **프로덕션**: https://funfungames.vercel.app
- 메타데이터에서 `metadataBase`로 설정됨 (`src/app/layout.tsx`)

---

## ⚠️ Next.js 16 주의사항

이 프로젝트는 **Next.js 16.2.1**을 사용하고 있습니다. 이전 버전과 중요한 차이가 있으므로 주의하세요.

### 중요 변경사항

1. **서버/클라이언트 컴포넌트 구분 필수**
   - 게임은 `"use client"` 필수
   - 메타데이터가 필요한 페이지는 서버 컴포넌트

2. **메타데이터는 Metadata 객체 사용**
   ```typescript
   export const metadata: Metadata = {
     title: '게임 이름',
   }
   ```

3. **API 라우트 변경**
   - 이전: `pages/api/hello.ts`
   - 현재: `app/api/hello/route.ts`

자세한 내용은 [AGENTS.md](./AGENTS.md)와 `node_modules/next/dist/docs/`를 참고하세요.

---

## 📊 TypeScript 설정

엄격한 TypeScript 설정이 활성화되어 있습니다:

```json
{
  "compilerOptions": {
    "strict": true,           // 모든 엄격한 옵션 활성화
    "noEmit": true,           // 타입 체크만 (컴파일 X)
    "paths": {
      "@/*": ["./src/*"]      // 경로 별칭
    }
  }
}
```

### 타입 정의 필수

```typescript
// ✅ 좋은 예
interface GameStats {
  label: string
  value: number
}

const stats: GameStats[] = [
  { label: 'Score', value: 0 }
]

// ❌ 나쁜 예
const stats = [{ label: 'Score', value: 0 }]  // 타입 없음
```

---

## 🔄 일반적인 개발 워크플로우

### 1. 새 기능 추가

```bash
# 1. 개발 서버 실행
npm run dev

# 2. 파일 수정 (자동 새로고침됨)
# 3. 브라우저에서 변경사항 확인

# 4. 완료 후 빌드 테스트
npm run build

# 5. 린트 검사
npm run lint
```

### 2. 게임 추가 프로세스

1. `game-data.ts`에 게임 메타데이터 추가
2. `game-[name].tsx` 컴포넌트 작성
3. 개발 서버에서 자동 반영 확인
4. 모바일/데스크톱에서 테스트
5. 배포 전 프로덕션 빌드 확인

### 3. 배포 전 체크리스트

```bash
# ✅ 다음을 확인하세요:
npm run lint         # 코드 검사
npm run build        # 빌드 성공 여부
npm start            # 프로덕션 빌드 로컬 실행 (정상 작동 확인)
```

---

## 🆘 문제 해결

### 개발 서버 시작 안 됨

```bash
# 1. node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 2. 캐시 초기화
npm run dev -- --reset
```

### 빌드 오류

```bash
# 1. TypeScript 오류 확인
npm run lint

# 2. Next.js 버전 확인
npm list next

# 3. 프로덕션 빌드 시도
npm run build
```

### 타입 오류

```bash
# TypeScript가 불평하면:
# 1. 파일에 타입 정의 추가
# 2. node_modules 재설치
# 3. TypeScript 캐시 재설정
```

---

## 📚 추가 학습 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 사이트](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

---

**행운을 빕니다! 🚀**
