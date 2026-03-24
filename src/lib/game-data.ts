export type GameItem = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  difficulty: string;
  emoji: string;
  tint: string;
  tags: string[];
  instructions: string;
  hints: string[];
};

export const gameCatalog: GameItem[] = [
  {
    slug: "tetris",
    title: "Tetris",
    tagline: "Classic block puzzle challenge",
    description:
      "떨어지는 블록을 회전하고 쌓아 가로 줄을 채우는 대표 퍼즐 게임입니다.",
    category: "Arcade Puzzle",
    difficulty: "Medium",
    emoji: "🧩",
    tint: "from-sky-100 via-white to-cyan-50",
    tags: ["keyboard", "classic", "focus"],
    instructions: "방향키로 블록을 이동하고 회전하여 가로줄을 채우세요.",
    hints: [
      "아래쪽을 평평하게 유지하면 이후 블록 배치가 쉬워집니다.",
      "긴 I 블록은 한 번에 여러 줄을 정리할 기회를 만들어줍니다.",
    ],
  },
  {
    slug: "2048",
    title: "2048",
    tagline: "Slide, merge, and chase the big tile",
    description: "숫자 타일을 합쳐 2048을 만드는 미니멀 퍼즐 게임입니다.",
    category: "Number Puzzle",
    difficulty: "Easy",
    emoji: "🔢",
    tint: "from-amber-100 via-white to-orange-50",
    tags: ["merge", "puzzle", "logic"],
    instructions: "방향키로 모든 타일을 밀고 같은 숫자끼리 합치세요.",
    hints: [
      "가장 큰 숫자를 구석에 고정하는 방식이 안정적입니다.",
      "무작정 흔들기보다 한 방향 축을 정해두면 좋습니다.",
    ],
  },
  {
    slug: "snake",
    title: "Snake",
    tagline: "Fast and clean arcade loop",
    description: "열매를 먹으며 몸집을 키우는 직관적인 클래식 아케이드 게임입니다.",
    category: "Arcade",
    difficulty: "Easy",
    emoji: "🐍",
    tint: "from-emerald-100 via-white to-lime-50",
    tags: ["reaction", "arcade", "speed"],
    instructions: "방향키로 뱀을 움직여 열매를 먹고 벽과 몸을 피하세요.",
    hints: [
      "너무 급하게 방향 전환하면 자기 몸에 갇히기 쉽습니다.",
      "가장자리만 도는 패턴보다 중앙 공간을 활용하세요.",
    ],
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    tagline: "Cute cards, quick focus, easy fun",
    description: "같은 그림 카드를 맞추는 가벼운 기억력 게임입니다.",
    category: "Casual",
    difficulty: "Easy",
    emoji: "🃏",
    tint: "from-rose-100 via-white to-fuchsia-50",
    tags: ["casual", "memory", "click"],
    instructions: "카드를 두 장씩 뒤집어 같은 이모지를 찾으세요.",
    hints: [
      "최근에 본 카드 위치를 머릿속으로 묶어 기억해보세요.",
      "같지 않은 카드도 다음 시도에 중요한 힌트가 됩니다.",
    ],
  },
  {
    slug: "chess",
    title: "Chess",
    tagline: "전략과 직관으로 AI를 이겨라",
    description: "5단계 난이도의 AI와 대전하는 체스 게임입니다. 기물을 잡으면 전투 이펙트가 터집니다!",
    category: "Strategy",
    difficulty: "Hard",
    emoji: "♟️",
    tint: "from-slate-100 via-white to-amber-50",
    tags: ["strategy", "AI", "turn-based"],
    instructions: "흰 기물을 클릭해 선택하고, 이동할 칸을 클릭하세요. AI가 자동으로 응수합니다.",
    hints: [
      "중앙을 장악하는 기물 배치가 유리합니다.",
      "킹을 일찍 캐슬링으로 안전한 곳으로 이동시키세요.",
    ],
  },
];

export function getGameBySlug(slug: string) {
  return gameCatalog.find((game) => game.slug === slug);
}
