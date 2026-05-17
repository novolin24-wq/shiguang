import { NextResponse } from "next/server";
import type { Meal } from "@/lib/mock-data";

export const runtime = "nodejs";

type CloudbaseApp = Awaited<ReturnType<typeof loadApp>>;

let appPromise: Promise<CloudbaseApp> | null = null;

async function loadApp() {
  const cloudbase = (await import("@cloudbase/js-sdk")).default;
  const envId = process.env.NEXT_PUBLIC_CB_ENV_ID;
  if (!envId) throw new Error("缺少环境变量 NEXT_PUBLIC_CB_ENV_ID");
  return cloudbase.init({ env: envId });
}

function getAppAsync() {
  if (!appPromise) appPromise = loadApp();
  return appPromise;
}

async function ensureAuth() {
  const app = await getAppAsync();
  const auth = app.auth({ persistence: "none" });
  try {
    await auth.signInAnonymously();
  } catch (error) {
    appPromise = null;
    throw error;
  }
}

async function db() {
  await ensureAuth();
  const app = await getAppAsync();
  return app.database();
}

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
    photoFileId: (doc.photoFileId ?? doc.photoFileID) as string | undefined,
    photoUrl: doc.photoUrl as string | undefined,
  };
}

async function refreshPhotoUrls(meals: Meal[]) {
  const fileIDs = meals
    .map((meal) => meal.photoFileId)
    .filter((fileID): fileID is string => Boolean(fileID));
  if (fileIDs.length === 0) return meals;

  const app = await getAppAsync();
  const res = await app.getTempFileURL({ fileList: fileIDs });
  const urlByFileID = new Map(
    (
      res.fileList as {
        fileID: string;
        tempFileURL?: string;
      }[]
    ).map((file) => [file.fileID, file.tempFileURL]),
  );

  return meals.map((meal) => {
    const refreshedUrl = meal.photoFileId
      ? urlByFileID.get(meal.photoFileId)
      : undefined;
    return refreshedUrl ? { ...meal, photoUrl: refreshedUrl } : meal;
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? 50);
    const day = url.searchParams.get("day");
    const d = await db();

    const collection = d.collection("meals");
    const query = day
      ? collection.where({ day }).orderBy("time", "desc")
      : collection.orderBy("day", "desc").orderBy("time", "desc");
    const res = await query.limit(Number.isFinite(limit) ? limit : 50).get();

    const meals = (res.data as Record<string, unknown>[]).map(docToMeal);
    return NextResponse.json({ meals: await refreshPhotoUrls(meals) });
  } catch (error) {
    console.error("Meal read failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "读取失败" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const meal = (await request.json()) as Omit<Meal, "id">;
    const d = await db();
    const res = await d.collection("meals").add({
      ...meal,
      createdAt: Date.now(),
    });

    return NextResponse.json({ id: res.id });
  } catch (error) {
    console.error("Meal write failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "写入失败" },
      { status: 500 },
    );
  }
}
