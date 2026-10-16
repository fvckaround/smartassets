import { NextResponse } from "next/server";
import { settleDue } from "@/lib/settle";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Called daily by Vercel Cron (see vercel.json). Vercel sends
// "Authorization: Bearer <CRON_SECRET>" automatically when CRON_SECRET is set.
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await settleDue({ limit: 200 });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("cron mature-investments error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}