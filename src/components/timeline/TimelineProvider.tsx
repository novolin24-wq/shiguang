"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { MEALS, TODAY, type Meal } from "@/lib/mock-data";

interface TimelineCtx {
  meals: Meal[];
  highlightedId: string | null;
  scrollNonce: number;
  toast: string | null;

  recordOpen: boolean;
  openRecord: () => void;
  closeRecord: () => void;

  addMeal: (input: Omit<Meal, "id" | "day"> & { day?: string }) => void;
}

const Ctx = createContext<TimelineCtx | null>(null);

export function useTimeline() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTimeline must be used inside <TimelineProvider>");
  return v;
}

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [meals, setMeals] = useState<Meal[]>(MEALS);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [scrollNonce, setScrollNonce] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);

  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openRecord = useCallback(() => setRecordOpen(true), []);
  const closeRecord = useCallback(() => setRecordOpen(false), []);

  const addMeal = useCallback<TimelineCtx["addMeal"]>(
    (input) => {
      const id = "new-" + Date.now();
      const newMeal: Meal = {
        id,
        day: input.day ?? TODAY,
        time: input.time,
        who: input.who,
        dish: input.dish,
        place: input.place,
        tag: input.tag,
        note: input.note,
        photo: input.photo,
        photoUrl: input.photoUrl,
      };
      setMeals((prev) => [newMeal, ...prev]);
      setRecordOpen(false);

      // 不在时间线？跳过去看
      if (pathname !== "/") router.push("/");

      // 让 TimelineStream 滚到顶
      setScrollNonce((n) => n + 1);

      // 1 秒高亮
      setHighlightedId(id);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightedId(null), 1100);

      // Toast「已记入今天」
      setToast("已记入今天");
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    },
    [pathname, router],
  );

  const value = useMemo<TimelineCtx>(
    () => ({
      meals,
      highlightedId,
      scrollNonce,
      toast,
      recordOpen,
      openRecord,
      closeRecord,
      addMeal,
    }),
    [
      meals,
      highlightedId,
      scrollNonce,
      toast,
      recordOpen,
      openRecord,
      closeRecord,
      addMeal,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
