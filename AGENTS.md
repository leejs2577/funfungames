# ⚠️ Next.js 16 주의사항

## 이것은 당신이 아는 Next.js가 아닙니다!

이 프로젝트는 **Next.js 16.2.1** 을 사용하고 있으며, 이전 버전의 Next.js와 **주요 차이점과 파괴적 변경(Breaking Changes)**이 있습니다.

### 🚨 중요: 코드 작성 전에 반드시 읽어주세요!

새로운 기능을 추가하거나 코드를 작성하기 전에, **반드시** `node_modules/next/dist/docs/` 디렉토리의 가이드를 읽고 확인하세요. API와 컨벤션, 파일 구조가 이전 버전과 다를 수 있습니다.

---

## 📖 주요 변경사항 확인 체크리스트

코드 작성 시 다음 항목들을 확인하세요:

- [ ] **렌더링 방식** - 서버 컴포넌트 vs 클라이언트 컴포넌트 구분
- [ ] **라우팅 시스템** - App Router (pages 아님)
- [ ] **메타데이터** - `Metadata` 객체 사용 (HTML 태그 직접 입력 X)
- [ ] **API 라우트** - 새로운 API 핸들러 방식
- [ ] **Image 컴포넌트** - `next/image` 최신 API 사용
- [ ] **하이드레이션** - 서버/클라이언트 미스매치 주의
- [ ] **Deprecated API** - 사용 금지된 API 확인

---

## 🔍 API 변경 예시

### ❌ 이전 방식 (Next.js 12-14)
```typescript
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello' })
}
```

### ✅ 새로운 방식 (Next.js 16)
```typescript
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

---

## 💡 서버/클라이언트 컴포넌트 구분

### 서버 컴포넌트 (기본값)
```typescript
// src/components/ServerComponent.tsx
// "use client" 없음!

import { getServerData } from '@/lib/data'

export async function ServerComponent() {
  const data = await getServerData() // ✅ 서버에서 직접 데이터 페칭 가능

  return <div>{data}</div>
}
```

### 클라이언트 컴포넌트
```typescript
// src/components/ClientComponent.tsx
'use client' // ✅ 필수!

import { useState } from 'react'

export function ClientComponent() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

---

## 📌 이 프로젝트에서의 구체적 사항

### 게임 컴포넌트는 클라이언트 컴포넌트

모든 게임 컴포넌트는 반드시 `"use client"` 지시어를 포함해야 합니다:

```typescript
// ✅ 올바른 방식
'use client'

import { useState } from 'react'

export function GameTetris({ game }: { game: GameItem }) {
  const [score, setScore] = useState(0)
  // ... 게임 로직
}
```

### 페이지 컴포넌트는 서버 컴포넌트 가능

메타데이터가 필요한 페이지는 서버 컴포넌트로 유지:

```typescript
// app/games/[slug]/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '게임 이름',
}

export default function GamePage() {
  // ...
}
```

---

## 🔗 참고 자료

프로젝트 진행 중 도움이 될 만한 문서들:

- **공식 문서**: `node_modules/next/dist/docs/`
- **마이그레이션 가이드**: Next.js 공식 마이그레이션 문서
- **API 레퍼런스**: Next.js API docs의 최신 내용

---

## ❗ 흔한 실수와 해결법

### 1. 클라이언트 컴포넌트에서 서버 함수 호출
```typescript
// ❌ 에러 발생!
'use client'

const result = await getServerData() // 불가능

// ✅ 올바른 방식 - Server Action 사용
'use client'

import { getServerData } from '@/app/actions'

async function fetchData() {
  const result = await getServerData()
}
```

### 2. 하이드레이션 미스매치
```typescript
// ❌ 위험: 서버와 클라이언트에서 다른 결과
const content = typeof window === 'undefined' ? 'server' : 'client'

// ✅ 안전: 일관된 결과
const content = 'consistent-value'
```

### 3. 잘못된 메타데이터 설정
```typescript
// ❌ 구식 방법
export default function Layout() {
  return (
    <html>
      <head>
        <title>My Page</title> {/* 이렇게 하면 안 됨 */}
      </head>
    </html>
  )
}

// ✅ 올바른 방법
export const metadata: Metadata = {
  title: 'My Page',
}

export default function Layout() {
  return <html><body>{/* ... */}</body></html>
}
```

---

## 🚀 문제 발생 시 대처법

1. **오류 메시지 확인** - Next.js 16은 더 명확한 오류 메시지 제공
2. **공식 문서 참고** - `node_modules/next/dist/docs/` 에서 해당 기능 찾기
3. **Deprecation 경고 무시 금지** - 경고가 나면 새로운 API로 마이그레이션하기
4. **로그 확인** - 브라우저 콘솔과 터미널의 빌드 로그 모두 확인

---

## 📚 추가 정보

더 자세한 정보는 [CLAUDE.md](./CLAUDE.md)를 참고하세요. CLAUDE.md에는:

- 프로젝트 전체 구조
- 개발 명령어
- 게임 컴포넌트 작성 패턴
- 배포 방법
- 타입스크립트 설정

등이 정리되어 있습니다.

---

**⚠️ 마지막 당부: 새로운 코드를 작성할 때는 항상 최신 Next.js 문서를 먼저 확인해주세요!**
