import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import Loan from "@/models/Loan";
import { LOAN_MIN, LOAN_MAX, LOAN_TERMS } from "@/lib/loans";
import { sendEmail, notifyAdmin, esc } from "@/lib/email";

export const maxDuration = 30;

// A user applies for a loan. Only one pending application at a time.
export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

    const b = await req.json().catch(() => ({}));
    const amount = Math.round(Number(b.amount) * 100) / 100;
    const durationDays = Number(b.durationDays);
    const purpose = String(b.purpose || "").replace(/\s+/g, " ").trim().slice(0, 500);

    if (!Number.isFinite(amount) || amount < LOAN_MIN || amount > LOAN_MAX) {
      return NextResponse.json(
        { error: `Amount must be between $${LOAN_MIN.toLocaleString()} and $${LOAN_MAX.toLocaleString()}.` },
        { status: 400 }
      );
    }
    if (!LOAN_TERMS.includes(durationDays)) {
      return NextResponse.json({ error: "Choose a valid loan term." }, { status: 400 });
    }
    if (purpose.length < 10) {
      return NextResponse.json({ error: "Tell us briefly what the loan is for (at least 10 characters)." }, { status: 400 });
    }

    await dbConnect();
    const open = await Loan.exists({ user: user._id, status: "pending" });
    if (open) {
      return NextResponse.json(
        { error: "You already have a loan application under review. Please wait for a decision." },
        { status: 409 }
      );
    }

    await Loan.create({ user: user._id, amount, durationDays, purpose });

    await sendEmail({
      to: user.email,
      subject: "We received your loan application",
      title: "Loan application received",
      html: `<p>Hello ${esc(String(user.name || "").split(" ")[0])},</p>
             <p>We received your application for a loan of <strong style="color:#fff;">$${amount.toLocaleString()}</strong> over ${durationDays} days.</p>
             <p>Our team will review it and email you with a decision.</p>`,
    });
    await notifyAdmin({
      subject: `New loan application: $${amount.toLocaleString()}`,
      title: "New loan application",
      rows: [
        ["User", `${user.name} (${user.email})`],
        ["Amount", `$${amount.toLocaleString()}`],
        ["Term", `${durationDays} days`],
        ["Purpose", purpose],
      ],
      link: "/admin/loans",
      linkLabel: "Review loan applications",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("loan apply error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
