"use client";

import { useEffect, useState } from "react";

interface StatsProps {
  userId?: string;
  partnerId?: string;
}

interface StatsData {
  total: number;
  together: number;
  cities: number;
}

export function Stats({ userId, partnerId }: StatsProps) {
  const [data, setData] = useState<StatsData>({ total: 0, together: 0, cities: 0 });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const { getMeals } = await import("@/lib/db");
        const meals = await getMeals(9999);
        if (cancelled) return;

        const total = meals.length;
        const together = meals.filter((m) => m.who === "together").length;
        const places = new Set(
          meals.map((m) => m.place).filter(Boolean),
        );
        setData({ total, together, cities: places.size });
      } catch {
        // keep zeros
      }
    })();
    return () => { cancelled = true; };
  }, [userId, partnerId]);

  const items = [
    { n: data.total, l: "顿饭" },
    { n: data.together, l: "一起吃" },
    { n: data.cities, l: "地点" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((s) => (
        <div
          key={s.l}
          className="bg-bg-card rounded-lg py-3 text-center shadow-soft"
        >
          <div className="text-[24px] font-serif text-ink tabular-nums leading-none">
            {s.n}
          </div>
          <div className="text-[10px] text-ink-faded mt-1">{s.l}</div>
        </div>
      ))}
    </div>
  );
}
