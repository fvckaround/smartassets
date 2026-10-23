import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import User from "@/models/User";
import Loan from "@/models/Loan";
import { sendEmail, esc, siteUrl } from "@/lib/email";

export const maxDuration = 30;

const DAY = 24 * 60 * 60 * 1000;

// Admin approves or declines a loan, with a reason.
// Approving credits the loan amount to the user's balance (in one database transaction).
export async function PATCH(req, { params }) {
  let dbSession;
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

    const b = await req.json().catch(() => ({}));
    const action = b.action;
    const note = String(b.note || "").trim().slice(0, 1000);
    if (!["approve", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
    if (note.length < 3) {
      return NextResponse.json({ error: "Write a short reason for your decision." }, { status: 400 });
    }

    // Connect first: on a cold start the session cannot be created before the DB is connected.
    await dbConnect();
    dbSession = await mongoose.startSession();

    let loan;
    await dbSession.withTransaction(async () => {
      const now = new Date();
      const pending = await Loan.findOne({ _id: id, status: "pending" }).session(dbSession);
      if (!pending) throw new Error("NOT_PENDING");

      pending.status = action === "approve" ? "approved" : "declined";
      pending.adminNote = note;
      pending.reviewedBy = admin._id;
      pending.reviewedAt = now;
      if (action === "approve") pending.dueAt = new Date(now.getTime() + pending.durationDays * DAY);
      await pending.save({ session: dbSession });

      if (action === "approve") {
        await User.updateOne({ _id: pending.user }, { $inc: { balance: pending.amount } }, { session: dbSession });
      }
      loan = pending;
    });

    const owner = await User.findById(loan.user).lean();
    if (owner) {
      const approved = action === "approve";
      await sendEmail({
        to: owner.email,
        subject: `Your loan application was ${approved ? "approved" : "declined"}`,
        title: `Loan ${approved ? "approved" : "declined"}`,
        html: `<p>Hello ${esc(String(owner.name || "").split(" ")[0])},</p>
               <p>Your application for a loan of <strong style="color:#fff;">$${loan.amount.toLocaleString()}</strong> over ${loan.durationDays} days was <strong style="color:#fff;">${approved ? "approved" : "declined"}</strong>.</p>
               ${approved ? `<p>The amount has been added to your account balance. Repayment is due by <strong style="color:#fff;">${loan.dueAt.toDateString()}</strong>.</p>` : ""}
               <div style="margin:16px 0;padding:14px 16px;border-left:3px solid #1fd18a;background:rgba(31,209,138,0.08);border-radius:6px;">
                 <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6ee7b7;margin-bottom:6px;">Reason from our team</div>
                 <div style="color:#e8f5ee;">${esc(note)}</div>
               </div>
               ${siteUrl() ? `<p><a href="${siteUrl()}/dashboard/loans" style="color:#1fd18a;">View your loans</a></p>` : ""}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.message === "NOT_PENDING") {
      return NextResponse.json({ error: "This loan has already been reviewed." }, { status: 409 });
    }
    console.error("admin loan error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  } finally {
    if (dbSession) await dbSession.endSession();
  }
}
