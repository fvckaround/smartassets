import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentAdmin } from "@/lib/session";
import User from "@/models/User";

export const maxDuration = 30;

export async function PATCH(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }
    if (id === admin._id.toString()) {
      return NextResponse.json({ error: "You cannot change your own status." }, { status: 400 });
    }

    const b = await req.json();
    if (!["active", "suspended"].includes(b.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await User.updateOne({ _id: id }, { status: b.status });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin user patch error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}