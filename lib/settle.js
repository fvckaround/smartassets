import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Investment from "@/models/Investment";
import { sendEmail } from "@/lib/email";

// Principal + the plan's target return, rounded to cents.
export function targetPayout(inv) {
  return Math.round(inv.amount * (1 + inv.targetReturnPercent / 100) * 100) / 100;
}

// Settles ONE active investment and credits the payout. Safe to call twice:
// the status filter guarantees an investment can only ever be paid once.
export async function settleInvestment(id, payoutAmount) {
  const dbSession = await mongoose.startSession();
  try {
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

    try {
      const owner = await User.findById(inv.user).lean();
      if (owner) {
        await sendEmail({
          to: owner.email,
          subject: `Investment completed: ${inv.planName}`,
          title: "Your investment has been completed",
          html: `<p>Your <strong>${inv.planName}</strong> investment of $${inv.amount.toLocaleString()} has reached the end of its term.
                 <strong>$${payoutAmount.toLocaleString()}</strong> has been credited to your available balance.</p>
                 <p>You can reinvest it or request a withdrawal from your dashboard.</p>`,
        });
      }
    } catch (mailErr) {
      console.error("settle email error:", mailErr);
    }
    return inv;
  } finally {
    await dbSession.endSession();
  }
}

// Settles every investment whose term has ended, at principal + target return.
// Pass userId to only settle that user's investments.
export async function settleDue({ userId, limit = 200 } = {}) {
  await dbConnect();
  const q = { status: "active", endsAt: { $lte: new Date() } };
  if (userId) q.user = userId;
  const due = await Investment.find(q)
    .sort({ endsAt: 1 })
    .limit(limit)
    .select("_id amount targetReturnPercent")
    .lean();

  let settled = 0;
  let failed = 0;
  for (const inv of due) {
    try {
      await settleInvestment(inv._id, targetPayout(inv));
      settled++;
    } catch (err) {
      if (err.message !== "NOT_ACTIVE") {
        failed++;
        console.error("auto settle error:", inv._id.toString(), err);
      }
    }
  }
  return { found: due.length, settled, failed };
}