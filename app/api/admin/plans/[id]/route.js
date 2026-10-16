import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import Plan from "@/models/Plan";

export const maxDuration = 30;

export async function PATCH(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const b = await req.json();
    const update = {};

    if (typeof b.active === "boolean") update.active = b.active;

    // Full edit: when a name is sent, validate and update every field.
    // Existing investments keep the terms they were created with (copied onto the Investment record).
    if (b.name !== undefined) {
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
      Object.assign(update, plan);
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    await dbConnect();
    await Plan.updateOne({ _id: id }, update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin plan patch error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}