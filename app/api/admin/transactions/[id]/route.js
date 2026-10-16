import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentAdmin } from "@/lib/session";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { sendEmail } from "@/lib/email";

export const maxDuration = 30;

export async function PATCH(req, { params }) {
  const dbSession = await mongoose.startSession();
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const body = await req.json();
    const action = body.action;
    const note = String(body.note || "").trim();
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    let result;
    await dbSession.withTransaction(async () => {
      // Only a pending transaction can be reviewed, and only once.
      const tx = await Transaction.findOneAndUpdate(
        { _id: id, status: "pending" },
        {
          status: action === "approve" ? "approved" : "rejected",
          adminNote: note,
          reviewedBy: admin._id,
          reviewedAt: new Date(),
        },
        { session: dbSession, new: true }
      );
      if (!tx) throw new Error("NOT_PENDING");

      if (tx.type === "deposit" && action === "approve") {
        await User.updateOne({ _id: tx.user }, { $inc: { balance: tx.amount } }, { session: dbSession });
      }
      if (tx.type === "withdrawal" && action === "reject") {
        // Return the held funds.
        await User.updateOne({ _id: tx.user }, { $inc: { balance: tx.amount } }, { session: dbSession });
      }
      result = tx;
    });

    const owner = await User.findById(result.user).lean();
    if (owner) {
      const verb = action === "approve" ? "approved" : "rejected";
      const safeNote = note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
      const extra =
        result.type === "withdrawal" && action === "reject"
          ? "<p>The amount has been returned to your account balance.</p>"
          : result.type === "deposit" && action === "approve"
          ? "<p>The amount has been added to your account balance.</p>"
          : "";
      await sendEmail({
        to: owner.email,
        subject: `Your ${result.type} was ${verb}`,
        title: `${result.type[0].toUpperCase() + result.type.slice(1)} ${verb}`,
        html: `<p>Your ${result.type} of <strong>$${result.amount.toLocaleString()}</strong> via ${result.method} was ${verb}.</p>
               ${extra}
               ${
                 note
                   ? `<div style="margin:16px 0;padding:14px 16px;border-left:3px solid #1fd18a;background:rgba(31,209,138,0.08);border-radius:6px;">
                        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6ee7b7;margin-bottom:6px;">Note from our team</div>
                        <div style="color:#e8f5ee;">${safeNote}</div>
                      </div>`
                   : ""
               }
               ${siteUrl ? `<p><a href="${siteUrl}/dashboard" style="color:#1fd18a;">View your dashboard</a></p>` : ""}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.message === "NOT_PENDING") {
      return NextResponse.json({ error: "Transaction is not pending." }, { status: 409 });
    }
    console.error("admin tx error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  } finally {
    await dbSession.endSession();
  }
}