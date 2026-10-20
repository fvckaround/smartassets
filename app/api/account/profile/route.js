import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import User from "@/models/User";
import { cleanText } from "@/lib/survey";

export const maxDuration = 30;

// Updates the signed-in user's own name, phone and country.
export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

    const b = await req.json().catch(() => ({}));
    const name = cleanText(b.name, 80);
    const phone = cleanText(b.phone, 30);
    const country = cleanText(b.country, 60);

    if (name.length < 2) return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    if (phone && !/^[+\d][\d\s()-]{5,29}$/.test(phone)) {
      return NextResponse.json({ error: "Enter a valid phone number, or leave it empty." }, { status: 400 });
    }

    await dbConnect();
    await User.updateOne({ _id: user._id }, { name, phone, country });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("profile update error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}