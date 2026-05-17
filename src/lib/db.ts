import { getAppAsync, ensureAuth } from "./cloudbase";
import type { Meal } from "./mock-data";

const COLLECTION = "meals";

async function db() {
  const app = await getAppAsync();
  return app.database();
}

/** 新增一顿饭，返回文档 ID */
export async function addMealToDB(
  meal: Omit<Meal, "id">,
): Promise<string> {
  await ensureAuth();
  const d = await db();
  const res = await d.collection(COLLECTION).add({
    ...meal,
    createdAt: Date.now(),
  });
  return res.id as string;
}

/** 读取最近的 N 顿，默认 50 */
export async function getMeals(limit = 50): Promise<Meal[]> {
  await ensureAuth();
  const d = await db();
  const res = await d
    .collection(COLLECTION)
    .orderBy("day", "desc")
    .orderBy("time", "desc")
    .limit(limit)
    .get();
  return (res.data as Record<string, unknown>[]).map(docToMeal);
}

/** 按日期查 */
export async function getMealsByDate(date: string): Promise<Meal[]> {
  await ensureAuth();
  const d = await db();
  const res = await d
    .collection(COLLECTION)
    .where({ day: date })
    .orderBy("time", "desc")
    .get();
  return (res.data as Record<string, unknown>[]).map(docToMeal);
}

/** CloudBase 文档 → Meal 类型 */
function docToMeal(doc: Record<string, unknown>): Meal {
  return {
    id: (doc._id as string) ?? (doc.id as string),
    day: doc.day as string,
    time: doc.time as string,
    who: doc.who as Meal["who"],
    dish: doc.dish as string,
    place: doc.place as string,
    tag: doc.tag as Meal["tag"],
    note: doc.note as string | undefined,
    photo: doc.photo as string | undefined,
    photoUrl: doc.photoUrl as string | undefined,
  };
}
