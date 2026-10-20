import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import User from "@/models/User";
import { sendEmail, esc, siteUrl } from "@/lib/email";

export const maxDuration = 30;

// Changes the signed-in user's password after checking the current one.
export async function POST(req) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

    const b = await req.json().catch(() => ({}));
    const current = String(b.currentPassword || "");
    const next = String(b.newPassword || "");
    const confirm = String(b.confirmPassword || "");

    if (!current || !next) return NextResponse.json({ error: "Fill in all password fields." }, { status: 400 });
    if (next.length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    if (next.length > 200) return NextResponse.json({ error: "New password is too long." }, { status: 400 });
    if (next !== confirm) return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    if (next === current) return NextResponse.json({ error: "Choose a password different from your current one." }, { status: 400 });

    await dbConnect();
    const user = await User.findById(sessionUser._id);
    if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

    const ok = await bcrypt.compare(current, user.password);
    if (!ok) return NextResponse.json({ error: "Your current password is incorrect." }, { status: 400 });

    user.password = await bcrypt.hash(next, 12);
    await user.save();

    // Security notice so the owner knows if someone else changed it.
    await sendEmail({
      to: user.email,
      subject: "Your password was changed",
      title: "Password changed",
      html: `<p>Hello ${esc(String(user.name || "").split(" ")[0])},</p>
             <p>The password for your Smart Assets account was just changed.</p>
             <p>If this was you, no action is needed. If it was not you, contact our support team immediately.</p>
             ${siteUrl() ? `<p><a href="${siteUrl()}/contact" style="color:#1fd18a;">Contact support</a></p>` : ""}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("password change error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}