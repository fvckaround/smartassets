import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentUser } from "@/lib/session";
import { walletLabel } from "@/lib/wallets";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import Transaction from "@/models/Transaction";
import { sendEmail, adminEmail } from "@/lib/email";

export const maxDuration = 30;

export async function POST(req) {
  const dbSession = await mongoose.startSession();
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const amount = Number(body.amount);
    const walletId = String(body.method || "");
    const address = String(body.address || "").trim();

    if (!Number.isFinite(amount) || amount < 10) {
      return NextResponse.json({ error: "Minimum withdrawal is $10." }, { status: 400 });
    }
    if (!mongoose.isValidObjectId(walletId)) {
      return NextResponse.json({ error: "Choose a valid payout method." }, { status: 400 });
    }
    const wallet = await Wallet.findOne({ _id: walletId, active: true }).lean();
    if (!wallet) {
      return NextResponse.json({ error: "That payout method is not available." }, { status: 400 });
    }
    if (address.length < 10) {
      return NextResponse.json({ error: "Enter a valid wallet address." }, { status: 400 });
    }

    const method = walletLabel(wallet);

    // Funds are held (deducted) when requested and returned if the request is rejected.
    await dbSession.withTransaction(async () => {
      const updated = await User.findOneAndUpdate(
        { _id: user._id, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session: dbSession, new: true }
      );
      if (!updated) throw new Error("INSUFFICIENT_FUNDS");
      await Transaction.create(
        [{ user: user._id, type: "withdrawal", amount, method, reference: address }],
        { session: dbSession }
      );
    });

    await sendEmail({
      to: user.email,
      bcc: adminEmail(),
      subject: "Withdrawal request received",
      title: "Your withdrawal request is pending",
      html: `<p>We received your withdrawal request of <strong>$${amount.toLocaleString()}</strong> via ${method}.
             It will be reviewed and processed shortly.</p>`,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err.message === "INSUFFICIENT_FUNDS") {
      return NextResponse.json({ error: "Insufficient balance." }, { status: 400 });
    }
    console.error("withdrawal error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  } finally {
    await dbSession.endSession();
  }
}