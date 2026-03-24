"use client";

import { useEffect, useState } from "react";

import { GameFrame } from "@/components/games/game-frame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MemoryCard = {
  id: string;
  value: string;
  open: boolean;
  matched: boolean;
};

const EMOJIS = ["🎈", "🌈", "🍓", "🎮", "🧁", "⭐", "🐥", "🪁"];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createDeck(): MemoryCard[] {
  return shuffle(
    [...EMOJIS, ...EMOJIS].map((value, index) => ({
      id: `${value}-${index}`,
      value,
      open: false,
      matched: false,
    })),
  );
}

function createStaticDeck(): MemoryCard[] {
  return [...EMOJIS, ...EMOJIS].map((value, index) => ({
    id: `${value}-${index}`,
    value,
    open: false,
    matched: false,
  }));
}

export function MemoryMatchGame({ inModal }: { inModal?: boolean } = {}) {
  const [cards, setCards] = useState<MemoryCard[]>(createStaticDeck);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState("같은 이모지를 두 장 맞춰보세요.");

  const matchedCount = cards.filter((card) => card.matched).length / 2;
  const complete = matchedCount === EMOJIS.length;

  const resetGame = () => {
    setCards(createDeck());
    setMoves(0);
    setLocked(false);
    setStatus("새 셔플 완료!");
  };

  useEffect(() => {
    const id = window.setTimeout(() => setCards(createDeck()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const onCardClick = (id: string) => {
    if (locked) return;

    setCards((current) => {
      const next = current.map((card) =>
        card.id === id && !card.open && !card.matched ? { ...card, open: true } : card,
      );

      const nextOpened = next.filter((card) => card.open && !card.matched);
      if (nextOpened.length === 2) {
        setMoves((value) => value + 1);
        const [first, second] = nextOpened;

        if (first.value === second.value) {
          setStatus("매치 성공!");
          return next.map((card) =>
            card.id === first.id || card.id === second.id ? { ...card, matched: true } : card,
          );
        }

        setLocked(true);
        setStatus("카드를 확인 중...");
        window.setTimeout(() => {
          setCards((inner) =>
            inner.map((card) =>
              card.id === first.id || card.id === second.id ? { ...card, open: false } : card,
            ),
          );
          setLocked(false);
          setStatus("다시 시도해보세요.");
        }, 700);
      }

      return next;
    });
  };

  const displayStatus = complete ? "모든 카드를 맞췄어요!" : status;

  return (
    <GameFrame
      title="Memory Match"
      subtitle="귀여운 카드가 들썩이는 캐주얼 메모리 게임입니다."
      badges={["Casual", "Cute", "Flip vibe"]}
      inModal={inModal}
      stats={[
        { label: "Pairs", value: `${matchedCount}/${EMOJIS.length}` },
        { label: "Moves", value: moves },
        { label: "State", value: complete ? "Clear" : "Playing" },
      ]}
      controls={
        <>
          <Button
            onClick={resetGame}
            className="rounded-full bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-[0_12px_30px_rgba(251,113,133,0.2)]"
          >
            Shuffle
          </Button>
          <p className="text-sm text-slate-400">{displayStatus}</p>
        </>
      }
      aside={
        <Card className="fun-panel bg-[var(--arcade-card)]">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--neon-cyan)]">Hint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-slate-400">
            <p>카드에 살짝 떠오르는 호버 효과를 넣어 더 즐겁게 보이도록 했습니다.</p>
            <p>매치된 카드는 더 밝고 반짝이는 컬러로 유지됩니다.</p>
          </CardContent>
        </Card>
      }
    >
      <div className="mx-auto grid w-full max-w-3xl grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onCardClick(card.id)}
            className={[
              "aspect-[4/5] rounded-[1.5rem] border text-4xl shadow-sm transition-colors duration-300",
              card.open || card.matched
                ? "border-white bg-gradient-to-br from-white to-yellow-50 shadow-[0_14px_28px_rgba(251,191,36,0.12)]"
                : "border-transparent bg-gradient-to-br from-rose-100 via-white to-sky-100 hover:shadow-[0_14px_28px_rgba(59,130,246,0.12)]",
            ].join(" ")}
          >
            {card.open || card.matched ? card.value : "?"}
          </button>
        ))}
      </div>
    </GameFrame>
  );
}
