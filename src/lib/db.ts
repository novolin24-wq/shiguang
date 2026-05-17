import type { Meal } from "./mock-data";

async function readError(res: Response, fallback: string) {
  const data = (await res.json().catch(() => null)) as {
    error?: string;
  } | null;
  return new Error(data?.error ?? fallback);
}

/** 新增一顿饭，返回文档 ID */
export async function addMealToDB(
  meal: Omit<Meal, "id">,
): Promise<string> {
  const res = await fetch("/api/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });
  if (!res.ok) throw await readError(res, "写入失败");
  const data = (await res.json()) as { id: string };
  return data.id;
}

/** 读取最近的 N 顿，默认 50 */
export async function getMeals(limit = 50): Promise<Meal[]> {
  const res = await fetch(`/api/meals?limit=${limit}`);
  if (!res.ok) throw await readError(res, "读取失败");
  const data = (await res.json()) as { meals: Meal[] };
  return data.meals;
}

/** 按日期查 */
export async function getMealsByDate(date: string): Promise<Meal[]> {
  const res = await fetch(`/api/meals?day=${date}`);
  if (!res.ok) throw await readError(res, "读取失败");
  const data = (await res.json()) as { meals: Meal[] };
  return data.meals;
}
