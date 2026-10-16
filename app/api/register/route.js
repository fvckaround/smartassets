import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendEmail, adminEmail } from "@/lib/email";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    const country = String(body.country || "").trim();
    const phone = String(body.phone || "").trim();
    const acceptedRisk = body.acceptedRisk === true;

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!acceptedRisk) {
      return NextResponse.json(
        { error: "You must acknowledge the risk disclosure to create an account." },
        { status: 400 }
      );
    }

    await dbConnect();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashed, country, phone });

    await sendEmail({
      to: email,
      bcc: adminEmail(),
      subject: "Welcome to Smart Assets Global Trade",
      title: `Welcome, ${name.split(" ")[0]}`,
      html: `<p>Your account has been created. You can now sign in and review the available investment plans.</p>
             <p>Reminder: investing in digital assets carries risk, including the loss of your entire capital.
             Target returns shown on plans are not guaranteed.</p>`,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}