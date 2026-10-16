import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentUser } from "@/lib/session";
import { walletLabel } from "@/lib/wallets";
import Wallet from "@/models/Wallet";
import Transaction from "@/models/Transaction";
import { sendEmail, notifyAdmin } from "@/lib/email";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const amount = Number(body.amount);
    const walletId = String(body.method || "");
    const reference = String(body.reference || "").trim();

    if (!Number.isFinite(amount) || amount < 10) {
      return NextResponse.json({ error: "Minimum deposit is $10." }, { status: 400 });
    }
    if (!mongoose.isValidObjectId(walletId)) {
      return NextResponse.json({ error: "Choose a valid coin." }, { status: 400 });
    }
    const wallet = await Wallet.findOne({ _id: walletId, active: true }).lean();
    if (!wallet) {
      return NextResponse.json({ error: "That deposit method is not available." }, { status: 400 });
    }
    if (reference.length < 6) {
      return NextResponse.json(
        { error: "Enter the transaction hash or reference of your transfer." },
        { status: 400 }
      );
    }

    const dup = await Transaction.findOne({ type: "deposit", reference });
    if (dup) {
      return NextResponse.json({ error: "This transaction reference was already submitted." }, { status: 409 });
    }

    const method = walletLabel(wallet);
    await Transaction.create({ user: user._id, type: "deposit", amount, method, reference });

    await sendEmail({
      to: user.email,
      subject: "Deposit received for review",
      title: "We received your deposit request",
      html: `<p>Your deposit request of <strong>$${amount.toLocaleString()}</strong> via ${method} is pending review.
             Your balance will be credited once the transfer is confirmed.</p>`,
    });

    await notifyAdmin({
      subject: `New deposit request: $${amount.toLocaleString()} from ${user.name}`,
      title: "New deposit awaiting review",
      rows: [
        ["User", `${user.name} (${user.email})`],
        ["Amount", `$${amount.toLocaleString()}`],
        ["Method", method],
        ["Hash / reference", reference],
      ],
      link: "/admin",
      linkLabel: "Review this deposit",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("deposit error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}