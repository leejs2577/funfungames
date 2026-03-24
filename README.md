# 🎮 FunFUnGames

밝고 캐주얼한 분위기에서 즐기는 미니게임 포털입니다. **테트리스**, **2048**, **스네이크**, **메모리 매치** 등 인기 있는 게임들을 한곳에서 만날 수 있습니다!

> 이 프로젝트는 Next.js 16과 React 19로 만들어진 최신 웹 애플리케이션입니다.

---

## 📋 프로젝트 개요

**FunFUnGames**는 다음과 같은 특징을 가지고 있습니다:

- ✨ **4가지 인기 게임** - 테트리스, 2048, 스네이크, 메모리 매치
- 🎨 **세련된 UI** - shadcn/ui와 Tailwind CSS로 만든 모던한 디자인
- 📱 **반응형 디자인** - 모바일, 태블릿, 데스크톱 모두 완벽 지원
- 🌍 **다국어 지원** - 한글 설명과 힌트 포함
- 🚀 **빠른 배포** - Vercel에서 자동 배포 지원

---

## 🚀 빠른 시작

### 사전 준비
- Node.js 18 이상 설치 필요
- npm, yarn, pnpm, 또는 bun 중 하나

### 개발 서버 실행

다음 명령어 중 하나를 선택하여 개발 서버를 시작하세요:

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 FunFUnGames 홈페이지가 나타납니다. 파일을 수정하면 자동으로 화면이 새로고침됩니다.

---

## 📁 프로젝트 구조

```
src/
├── app/                      # Next.js 앱 라우터 (페이지 및 레이아웃)
│   ├── page.tsx             # 홈페이지 (게임 카탈로그 표시)
│   ├── layout.tsx           # 루트 레이아웃 (헤더, 메타데이터)
│   ├── globals.css          # 전역 스타일 및 게임 패널 디자인
│   ├── games/
│   │   ├── page.tsx         # 게임 목록 페이지
│   │   └── [slug]/page.tsx  # 동적 게임 상세 페이지
│   ├── opengraph-image.tsx  # SNS 공유용 Open Graph 이미지
│   └── twitter-image.tsx    # Twitter/X 공유용 이미지
├── components/              # 재사용 가능한 React 컴포넌트
│   ├── ui/                  # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx       # 버튼 컴포넌트
│   │   ├── card.tsx         # 카드 컴포넌트
│   │   └── badge.tsx        # 배지 컴포넌트
│   ├── games/               # 게임별 컴포넌트
│   │   ├── game-frame.tsx      # 모든 게임의 공통 레이아웃 래퍼
│   │   ├── game-tetris.tsx     # 테트리스 게임
│   │   ├── game-2048.tsx       # 2048 게임
│   │   ├── game-snake.tsx      # 스네이크 게임
│   │   └── game-memory-match.tsx # 메모리 매치 게임
│   └── site-header.tsx      # 사이트 상단 헤더 및 네비게이션
└── lib/
    ├── game-data.ts         # 게임 카탈로그 데이터 및 타입 정의
    └── utils.ts             # 유틸리티 함수 (cn - 클래스명 병합)
```

---

## 🎮 게임 설명

### 1. 테트리스 🧩
클래식한 블록 퍼즐 게임입니다. 떨어지는 블록을 회전하고 배치하여 가로 줄을 완성하세요!
- **난이도**: 중상
- **태그**: 키보드 조작, 클래식, 집중력

### 2. 2048 🔢
숫자 타일을 합쳐서 2048을 만드는 로직 퍼즐입니다. 전략적으로 타일을 배치해보세요!
- **난이도**: 쉬움
- **태그**: 병합, 퍼즐, 논리

### 3. 스네이크 🐍
열매를 먹으며 뱀을 키우는 고전 아케이드 게임입니다. 반응 속도와 전략이 필요합니다!
- **난이도**: 쉬움
- **태그**: 반응속도, 아케이드, 스피드

### 4. 메모리 매치 🃏
같은 그림의 카드를 찾는 기억력 게임입니다. 가벼운 분위기에서 즐길 수 있습니다!
- **난이도**: 쉬움
- **태그**: 캐주얼, 기억력, 클릭

---

## 🛠️ 주요 명령어

### 개발 관련 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드 생성
npm run build

# 프로덕션 빌드를 로컬에서 실행
npm start

# ESLint로 코드 검사 (문법/스타일 체크)
npm run lint
```

### 배포 관련 명령어

```bash
# Vercel에 미리보기 버전 배포
npm run deploy:preview

# Vercel에 프로덕션 버전 배포
npm run deploy:prod
```

---

## 💻 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 16.2.1 | 웹 프레임워크 |
| **React** | 19.2.4 | UI 라이브러리 |
| **TypeScript** | 5.x | 타입 안정성 |
| **Tailwind CSS** | 4.x | 스타일링 |
| **shadcn/ui** | 4.1.0 | UI 컴포넌트 라이브러리 |
| **Vercel** | - | 배포 플랫폼 |

---

## 📝 코드 스타일 및 컨벤션

### 경로 별칭 (Path Alias)

`tsconfig.json`에 설정된 경로 별칭을 사용하면 import가 더 깔끔해집니다:

```typescript
// ✅ 좋은 예
import { Button } from '@/components/ui/button'
import { gameCatalog } from '@/lib/game-data'

// ❌ 피해야 할 예
import { Button } from '../../../components/ui/button'
import { gameCatalog } from '../../lib/game-data'
```

### 클래스명 병합

`cn()` 함수를 사용하여 Tailwind 클래스를 동적으로 병합할 수 있습니다:

```typescript
import { cn } from '@/lib/utils'

// 조건부 스타일 적용
<button className={cn('px-4 py-2', isActive && 'bg-blue-500')} />
```

### 게임 컴포넌트 작성 패턴

모든 게임은 다음 구조를 따릅니다:

1. **`"use client"` 지시어** - 클라이언트 사이드 인터랙션 필요
2. **상태 관리** - `useState` 또는 `useReducer`로 게임 상태 관리
3. **GameFrame 래핑** - 모든 게임은 `GameFrame` 컴포넌트로 감싸짐
4. **통계 전달** - 점수, 레벨 등의 통계를 `stats` props로 전달

예시:
```typescript
export function GameTetris({ game }: { game: GameItem }) {
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)

  return (
    <GameFrame
      title={game.title}
      subtitle={game.description}
      badges={game.tags}
      stats={[
        { label: 'Score', value: score },
        { label: 'Level', value: level }
      ]}
      controls={<button>시작</button>}
    >
      {/* 게임 렌더링 */}
    </GameFrame>
  )
}
```

---

## 🎨 게임 카탈로그 확장하기

새로운 게임을 추가하려면 다음 단계를 따르세요:

### 1단계: 게임 데이터 추가
`src/lib/game-data.ts`의 `gameCatalog` 배열에 새 게임을 추가합니다:

```typescript
{
  slug: "new-game",
  title: "New Game",
  tagline: "짧은 설명",
  description: "상세 설명입니다.",
  category: "Arcade",
  difficulty: "Easy",
  emoji: "🎯",
  tint: "from-purple-100 via-white to-pink-50",
  tags: ["tag1", "tag2"],
  instructions: "게임 방법을 설명합니다.",
  hints: ["팁 1", "팁 2"]
}
```

### 2단계: 게임 컴포넌트 작성
`src/components/games/game-new-game.tsx` 파일을 생성합니다:

```typescript
'use client'

import { GameItem } from '@/lib/game-data'
import { GameFrame } from './game-frame'
import { useState } from 'react'

export function GameNewGame({ game }: { game: GameItem }) {
  const [score, setScore] = useState(0)

  return (
    <GameFrame
      title={game.title}
      subtitle={game.description}
      badges={game.tags}
      stats={[{ label: 'Score', value: score }]}
      controls={<button>시작</button>}
    >
      {/* 게임 컨텐츠 */}
    </GameFrame>
  )
}
```

### 3단계: 게임 페이지에서 렌더링
`src/app/games/[slug]/page.tsx`에서 동적으로 렌더링됩니다.

---

## 🚀 배포하기

### Vercel 배포 (권장)

이 프로젝트는 Vercel에서 최적화되도록 설계되었습니다.

```bash
# 미리보기 배포
npm run deploy:preview

# 프로덕션 배포
npm run deploy:prod
```

**현재 배포 주소**: [https://funfungames.vercel.app](https://funfungames.vercel.app)

### 환경 변수

배포 시 필요한 환경 변수:
- `VERCEL_TOKEN`: Vercel 배포 토큰 (⚠️ `.gitignore`에 추가됨)

---

## ⚠️ 중요 노트

### Next.js 16 주의사항
이 프로젝트는 **Next.js 16.2.1**을 사용합니다. 이전 버전과 다를 수 있으니 코드 작성 시 주의하세요:

- 새로운 기능 추가 시 `node_modules/next/dist/docs/` 참고
- 서버/클라이언트 컴포넌트 구분 명확히 하기
- 메타데이터 설정 최신 API 사용

### 한글 콘텐츠
게임 설명과 힌트가 한글로 작성되어 있습니다. 새로운 게임 추가 시 일관성 유지해주세요.

### 반응형 디자인
모든 게임이 모바일, 태블릿, 데스크톱에서 잘 보이도록 테스트해주세요.

### TypeScript
엄격한 TypeScript 설정이 활성화되어 있습니다. 항상 타입을 정의하세요.

---

## 📚 추가 학습 자료

- [Next.js 공식 문서](https://nextjs.org/docs) - Next.js 기능 학습
- [React 공식 문서](https://react.dev) - React 기본 개념
- [Tailwind CSS 가이드](https://tailwindcss.com/docs) - 스타일링
- [shadcn/ui 컴포넌트](https://ui.shadcn.com) - UI 컴포넌트

---

## 🤝 기여 방법

이 프로젝트에 기여하고 싶으신가요? 언제든지 환영합니다! 🎉

1. 프로젝트를 Fork 하세요
2. 새로운 Branch를 만드세요 (`git checkout -b feature/amazing-feature`)
3. 변경 사항을 Commit 하세요 (`git commit -m 'Add amazing feature'`)
4. Branch로 Push 하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 열어주세요

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**행복한 게이밍! 🎮✨**
