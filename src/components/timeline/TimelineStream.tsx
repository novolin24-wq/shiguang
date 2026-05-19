"use client";

import { useEffect, useMemo, useState } from "react";
import { groupMeals } from "@/lib/mock-data";
import type { Memory } from "@/lib/mock-data";
import { MemoryCard } from "./MemoryCard";
import { MealCard } from "./MealCard";
import { DaySeparator } from "./DaySeparator";
import { GhostHint } from "./GhostHint";
import { EndOfTime } from "./EndOfTime";
import { useTimeline } from "./TimelineProvider";

interface Props {
  memory: Memory;
}

export function TimelineStream({ memory }: Props) {
  const { meals, highlightedId, scrollNonce, deleteMeal } = useTimeline();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [memorySeed, setMemorySeed] = useState(0);

  const groups = useMemo(() => groupMeals(meals), [meals]);

  // 新记录入账 → 滚到顶
  useEffect(() => {
    if (scrollNonce === 0) return;
    const main = document.getElementById("app-scroll");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollNonce]);

  return (
    <div onClick={() => setExpandedId(null)}>
      {/* 下拉提示 · 静态文字版（真实下拉手势先不做） */}
      <div className="text-center mb-4">
        <span className="font-serif italic text-[11.5px] text-ink-faded/80 tracking-wider">
          ↓ 下拉，再想一次
        </span>
      </div>

      <MemoryCard
        key={memorySeed}
        memory={memory}
        onReroll={() => setMemorySeed((s) => s + 1)}
      />

      {groups.map((g) => (
        <section key={g.key}>
          <DaySeparator label={g.key} sub={g.sub} fade={g.fade} />
          <div className="space-y-2.5">
            {g.meals.map((m) => (
              <MealCard
                key={m.id}
                meal={m}
                expanded={expandedId === m.id}
                highlighted={highlightedId === m.id}
                onDelete={deleteMeal}
                onToggle={(e) => {
                  e.stopPropagation();
                  setExpandedId(expandedId === m.id ? null : m.id);
                }}
              />
            ))}
            {g.key === "今天" && !highlightedId && <GhostHint />}
          </div>
        </section>
      ))}

      <EndOfTime />
    </div>
  );
}
