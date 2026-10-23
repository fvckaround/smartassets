import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import User from "@/models/User";
import Plan from "@/models/Plan";
import Investment from "@/models/Investment";
import { sendEmail, notifyAdmin } from "@/lib/email";

export const maxDuration = 30;

export async function POST(req) {
  let dbSession;
  try {
    // Connect first: on a cold start the session cannot be created before the DB is connected.
    await dbConnect();
    dbSession = await mongoose.startSession();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const amount = Number(body.amount);
    const planId = String(body.planId || "");

    if (!mongoose.isValidObjectId(planId)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }
    const plan = await Plan.findOne({ _id: planId, active: true }).lean();
    if (!plan) return NextResponse.json({ error: "Plan not available." }, { status: 404 });

    if (!Number.isFinite(amount) || amount < plan.minAmount || (plan.maxAmount != null && amount > plan.maxAmount)) {
      return NextResponse.json(
        {
          error:
            plan.maxAmount != null
              ? `Amount must be between $${plan.minAmount} and $${plan.maxAmount} for this plan.`
              : `Minimum amount for this plan is $${plan.minAmount}.`,
        },
        { status: 400 }
      );
    }

    const endsAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);

    await dbSession.withTransaction(async () => {
      const updated = await User.findOneAndUpdate(
        { _id: user._id, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session: dbSession, new: true }
      );
      if (!updated) throw new Error("INSUFFICIENT_FUNDS");
      await Investment.create(
        [
          {
            user: user._id,
            plan: plan._id,
            planName: plan.name,
            amount,
            targetReturnPercent: plan.targetReturnPercent,
            durationDays: plan.durationDays,
            endsAt,
          },
        ],
        { session: dbSession }
      );
    });

    await sendEmail({
      to: user.email,
      subject: `Investment started: ${plan.name}`,
      title: "Your investment is active",
      html: `<p>You invested <strong>$${amount.toLocaleString()}</strong> in <strong>${plan.name}</strong>.
             The term ends on ${endsAt.toDateString()}. The ${plan.targetReturnPercent}% figure is a target, not a guaranteed return.</p>`,
    });

    await notifyAdmin({
      subject: `New investment: $${amount.toLocaleString()} in ${plan.name}`,
      title: "A user purchased a plan",
      rows: [
        ["User", `${user.name} (${user.email})`],
        ["Plan", plan.name],
        ["Amount", `$${amount.toLocaleString()}`],
        ["Target return", `${plan.targetReturnPercent}%`],
        ["Ends", endsAt.toDateString()],
      ],
      link: "/admin/investments",
      linkLabel: "View investments",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err.message === "INSUFFICIENT_FUNDS") {
      return NextResponse.json({ error: "Insufficient balance. Make a deposit first." }, { status: 400 });
    }
    console.error("investment error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  } finally {
    if (dbSession) await dbSession.endSession();
  }
}