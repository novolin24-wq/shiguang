import type { Meal } from "./mock-data";
import { getCurrentUser } from "./auth";
import { getPartner } from "./relation";

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
  const user = await getCurrentUser();
  if (!user) throw new Error("请先登录后再记录");

  const res = await fetch("/api/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...meal, userId: user.uid }),
  });
  if (!res.ok) throw await readError(res, "写入失败");
  const data = (await res.json()) as { id: string };
  return data.id;
}

async function getVisibleUserIds() {
  const user = await getCurrentUser();
  if (!user) return [];

  const partner = await getPartner(user.uid);
  return partner ? [user.uid, partner.uid] : [user.uid];
}

function mealQueryParams(params: Record<string, string | number | string[]>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, item);
    } else {
      search.set(key, String(value));
    }
  }
  return search.toString();
}

/** 读取最近的 N 顿，默认 50 */
export async function getMeals(limit = 50): Promise<Meal[]> {
  const userIds = await getVisibleUserIds();
  if (userIds.length === 0) return [];

  const res = await fetch(
    `/api/meals?${mealQueryParams({ limit, userId: userIds })}`,
  );
  if (!res.ok) throw await readError(res, "读取失败");
  const data = (await res.json()) as { meals: Meal[] };
  return data.meals;
}

/** 按日期查 */
export async function getMealsByDate(date: string): Promise<Meal[]> {
  const userIds = await getVisibleUserIds();
  if (userIds.length === 0) return [];

  const res = await fetch(
    `/api/meals?${mealQueryParams({ day: date, userId: userIds })}`,
  );
  if (!res.ok) throw await readError(res, "读取失败");
  const data = (await res.json()) as { meals: Meal[] };
  return data.meals;
}

/** 删除自己的一顿饭 */
export async function deleteMealFromDB(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("请先登录后再删除");

  const search = new URLSearchParams({
    id,
    userId: user.uid,
  });
  const res = await fetch(`/api/meals?${search.toString()}`, {
    method: "DELETE",
  });
  if (!res.ok) throw await readError(res, "删除失败");
}
