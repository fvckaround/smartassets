import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import Plan from "@/models/Plan";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const b = await req.json();
    const plan = {
      name: String(b.name || "").trim(),
      description: String(b.description || "").trim(),
      minAmount: Number(b.minAmount),
      maxAmount: Number(b.maxAmount),
      targetReturnPercent: Number(b.targetReturnPercent),
      durationDays: Number(b.durationDays),
      riskLevel: ["Low", "Medium", "High"].includes(b.riskLevel) ? b.riskLevel : "Medium",
    };

    if (!plan.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    for (const k of ["minAmount", "maxAmount", "targetReturnPercent", "durationDays"]) {
      if (!Number.isFinite(plan[k]) || plan[k] < 0) {
        return NextResponse.json({ error: `Invalid ${k}.` }, { status: 400 });
      }
    }
    if (plan.minAmount < 1 || plan.maxAmount < plan.minAmount || plan.durationDays < 1) {
      return NextResponse.json({ error: "Check min, max and duration values." }, { status: 400 });
    }

    await Plan.create(plan);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("admin plan create error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}