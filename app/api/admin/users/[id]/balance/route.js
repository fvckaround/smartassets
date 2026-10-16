import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import User from "@/models/User";
import BalanceAdjustment from "@/models/BalanceAdjustment";
import { sendEmail } from "@/lib/email";

export const maxDuration = 30;

export async function POST(req, { params }) {
  let dbSession;
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const b = await req.json();
    const type = b.type;
    const note = String(b.note || "").trim();
    const amount = Math.round(Number(b.amount) * 100) / 100;

    if (!["add", "deduct"].includes(type)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
    }
    if (note.length < 3) {
      return NextResponse.json({ error: "Add a short reason for the record." }, { status: 400 });
    }

    await dbConnect();
    dbSession = await mongoose.startSession();

    let updated;
    await dbSession.withTransaction(async () => {
      // A deduction can never take the balance below zero.
      const filter = type === "deduct" ? { _id: id, balance: { $gte: amount } } : { _id: id };
      const delta = type === "add" ? amount : -amount;
      const user = await User.findOneAndUpdate(
        filter,
        { $inc: { balance: delta } },
        { session: dbSession, new: true }
      );
      if (!user) throw new Error(type === "deduct" ? "INSUFFICIENT" : "NO_USER");

      await BalanceAdjustment.create(
        [{ user: id, admin: admin._id, type, amount, note, balanceAfter: user.balance }],
        { session: dbSession }
      );
      updated = user;
    });

    await sendEmail({
      to: updated.email,
      subject: "Your account balance was updated",
      title: "Balance updated",
      html: `<p>Your balance was ${type === "add" ? "credited" : "debited"} by <strong>$${amount.toLocaleString()}</strong>.</p>
             <p>Reason: ${note.replace(/</g, "&lt;")}</p>
             <p>New balance: <strong>$${updated.balance.toLocaleString()}</strong></p>`,
    });

    return NextResponse.json({ ok: true, balance: updated.balance });
  } catch (err) {
    if (err.message === "INSUFFICIENT") {
      return NextResponse.json({ error: "That is more than the user's current balance." }, { status: 400 });
    }
    if (err.message === "NO_USER") {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.error("admin balance error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  } finally {
    if (dbSession) await dbSession.endSession();
  }
}