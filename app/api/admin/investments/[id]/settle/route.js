import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentAdmin } from "@/lib/session";
import User from "@/models/User";
import Investment from "@/models/Investment";
import { sendEmail } from "@/lib/email";

export const maxDuration = 30;

// Settling records the actual payout (which may be above, equal to, or below the amount invested)
// and credits it to the investor's balance. Nothing is paid out automatically.
export async function POST(req, { params }) {
  const dbSession = await mongoose.startSession();
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const body = await req.json();
    const payoutAmount = Number(body.payoutAmount);
    if (!Number.isFinite(payoutAmount) || payoutAmount < 0) {
      return NextResponse.json({ error: "Enter a valid payout amount (0 or more)." }, { status: 400 });
    }

    let inv;
    await dbSession.withTransaction(async () => {
      inv = await Investment.findOneAndUpdate(
        { _id: id, status: "active" },
        { status: "settled", payoutAmount, settledAt: new Date() },
        { session: dbSession, new: true }
      );
      if (!inv) throw new Error("NOT_ACTIVE");
      if (payoutAmount > 0) {
        await User.updateOne({ _id: inv.user }, { $inc: { balance: payoutAmount } }, { session: dbSession });
      }
    });

    const owner = await User.findById(inv.user).lean();
    if (owner) {
      await sendEmail({
        to: owner.email,
        subject: `Investment settled: ${inv.planName}`,
        title: "Your investment has been settled",
        html: `<p>Your <strong>${inv.planName}</strong> investment of $${inv.amount.toLocaleString()} has been settled.
               <strong>$${payoutAmount.toLocaleString()}</strong> has been credited to your balance.</p>`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.message === "NOT_ACTIVE") {
      return NextResponse.json({ error: "Investment is not active." }, { status: 409 });
    }
    console.error("admin settle error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  } finally {
    await dbSession.endSession();
  }
}