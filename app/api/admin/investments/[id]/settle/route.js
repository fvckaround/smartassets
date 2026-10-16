import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentAdmin } from "@/lib/session";
import { settleInvestment } from "@/lib/settle";

export const maxDuration = 30;

// Manual override: settle one active investment with a payout you choose
// (above, equal to, or below the amount invested). Normal settlement is automatic.
export async function POST(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }
    const body = await req.json();
    const payoutAmount = Math.round(Number(body.payoutAmount) * 100) / 100;
    if (!Number.isFinite(payoutAmount) || payoutAmount < 0) {
      return NextResponse.json({ error: "Enter a valid payout amount (0 or more)." }, { status: 400 });
    }

    await settleInvestment(id, payoutAmount);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.message === "NOT_ACTIVE") {
      return NextResponse.json({ error: "Investment is not active." }, { status: 409 });
    }
    console.error("admin settle error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}