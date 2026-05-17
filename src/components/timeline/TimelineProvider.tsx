"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { MEALS, TODAY, type Meal } from "@/lib/mock-data";
import { addMealToDB, getMeals } from "@/lib/db";
import { uploadMealPhoto, getFileUrl } from "@/lib/storage";

interface TimelineCtx {
  meals: Meal[];
  highlightedId: string | null;
  scrollNonce: number;
  toast: string | null;
  dbReady: boolean;

  recordOpen: boolean;
  openRecord: () => void;
  closeRecord: () => void;

  addMeal: (
    input: Omit<Meal, "id" | "day"> & { day?: string; photoFile?: File },
  ) => void;
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
  const [dbReady, setDbReady] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [scrollNonce, setScrollNonce] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);

  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 启动时尝试从数据库加载，失败则静默使用 mock
  useEffect(() => {
    let cancelled = false;
    getMeals(100)
      .then((dbMeals) => {
        if (cancelled) return;
        if (dbMeals.length > 0) {
          setMeals(dbMeals);
        }
        // 无论有没有数据，标记 DB 可用
        setDbReady(true);
      })
      .catch(() => {
        // DB 不可用，保持 mock 数据
        if (!cancelled) setDbReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openRecord = useCallback(() => setRecordOpen(true), []);
  const closeRecord = useCallback(() => setRecordOpen(false), []);

  const addMeal = useCallback<TimelineCtx["addMeal"]>(
    (input) => {
      const tempId = "new-" + Date.now();
      const day = input.day ?? TODAY;

      // 先乐观插入（用本地 blob URL 显示照片）
      const newMeal: Meal = {
        id: tempId,
        day,
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

      if (pathname !== "/") router.push("/");
      setScrollNonce((n) => n + 1);

      setHighlightedId(tempId);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightedId(null), 1100);

      setToast("已记入今天");
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);

      // 后台异步：上传照片 → 写入数据库 → 用真实数据替换临时记录
      (async () => {
        try {
          let photoUrl = input.photoUrl;

          // 有原始 File 则上传
          if (input.photoFile) {
            const fileID = await uploadMealPhoto(input.photoFile);
            photoUrl = await getFileUrl(fileID);
          }

          const { photoFile: _, ...mealData } = input;
          const dbId = await addMealToDB({
            ...mealData,
            day,
            photoUrl,
          });

          // 用数据库返回的真实 ID 替换临时 ID
          setMeals((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, id: dbId, photoUrl } : m,
            ),
          );
        } catch {
          // 写库失败 → 本地数据保留，用户不会丢数据感知
          // 下次刷新时 mock 兜底
        }
      })();
    },
    [pathname, router],
  );

  const value = useMemo<TimelineCtx>(
    () => ({
      meals,
      highlightedId,
      scrollNonce,
      toast,
      dbReady,
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
      dbReady,
      recordOpen,
      openRecord,
      closeRecord,
      addMeal,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
