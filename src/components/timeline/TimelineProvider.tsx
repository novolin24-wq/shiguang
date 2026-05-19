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
import {
  addMealToDB,
  deleteMealFromDB,
  getMeals,
  updateMealInDB,
} from "@/lib/db";
import { uploadMealPhoto } from "@/lib/storage";
import { createMealPhotoDisplayUrl } from "@/lib/image-upload";

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
  deleteMeal: (meal: Meal) => void;
}

const Ctx = createContext<TimelineCtx | null>(null);

function getCloudbaseToast(error: unknown) {
  const text =
    error instanceof Error ? error.message : JSON.stringify(error ?? "");
  if (text.includes("图片")) {
    return text;
  }
  if (text.includes("匿名登录") || text.includes("signInAnonymously")) {
    return "云端没记上：请先开启匿名登录";
  }
  if (text.includes("collection") || text.includes("meals")) {
    return "云端没记上：请检查 meals 集合";
  }
  return "云端没记上，请稍后再试";
}

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

  const showToast = useCallback((message: string, duration = 2200) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), duration);
  }, []);

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
        photoFileId: input.photoFileId,
        photoUrl: input.photoUrl,
      };
      setMeals((prev) => [newMeal, ...prev]);
      setRecordOpen(false);

      if (pathname !== "/") router.push("/");
      setScrollNonce((n) => n + 1);

      setHighlightedId(tempId);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightedId(null), 1100);

      showToast("正在记入云端…", 2800);

      // 后台异步：先写数据库，再尽力补照片，避免 Storage 超时导致整条记录丢失。
      (async () => {
        try {
          let photoUrl = input.photoUrl;
          let photoFileId = input.photoFileId;

          const dbId = await addMealToDB({
            day,
            time: input.time,
            who: input.who,
            dish: input.dish,
            place: input.place,
            tag: input.tag,
            note: input.note,
            photo: input.photo,
            photoFileId,
            photoUrl,
          });

          setMeals((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, id: dbId, photoFileId, photoUrl } : m,
            ),
          );
          showToast("已记入云端");

          if (!input.photoFile) return;

          try {
            photoUrl = await createMealPhotoDisplayUrl(input.photoFile);
            const uploaded = await uploadMealPhoto(input.photoFile);
            photoFileId = uploaded.fileID;
            await updateMealInDB(dbId, { photoFileId, photoUrl });
            setMeals((prev) =>
              prev.map((m) =>
                m.id === dbId ? { ...m, photoFileId, photoUrl } : m,
              ),
            );
          } catch (photoError) {
            console.error("CloudBase photo upload failed", photoError);
            showToast("文字已保存，照片稍后再补", 4200);
          }
        } catch (error) {
          console.error("CloudBase save failed", error);
          showToast(getCloudbaseToast(error), 4200);
          // 写库失败时保留本地卡片，避免用户刚填的内容立刻丢失。
        }
      })();
    },
    [pathname, router, showToast],
  );

  const deleteMeal = useCallback<TimelineCtx["deleteMeal"]>(
    (meal) => {
      setMeals((prev) => prev.filter((m) => m.id !== meal.id));
      showToast("已删除");

      if (meal.id.startsWith("new-")) return;

      void deleteMealFromDB(meal.id).catch((error) => {
        console.error("CloudBase delete failed", error);
        setMeals((prev) => [meal, ...prev]);
        showToast("云端删除失败，请稍后再试", 3600);
      });
    },
    [showToast],
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
      deleteMeal,
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
      deleteMeal,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
