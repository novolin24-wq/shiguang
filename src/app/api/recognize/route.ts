import { NextResponse } from "next/server";
import { recognizeFood } from "@/lib/baidu-ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as { image?: string };
    const image = data.image?.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
    if (!image) {
      return NextResponse.json({ name: null });
    }

    const name = await recognizeFood(image);
    return NextResponse.json({ name });
  } catch (error) {
    console.error("Food recognize API failed", error);
    return NextResponse.json({ name: null });
  }
}
