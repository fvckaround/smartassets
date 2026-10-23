import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import Package from "@/models/Package";
import { readPackage } from "@/lib/packages";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const b = await req.json().catch(() => ({}));
    const { pkg, error } = readPackage(b);
    if (error) return NextResponse.json({ error }, { status: 400 });

    await dbConnect();
    await Package.create({ ...pkg, published: b.published !== false });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("admin package create error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
