import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { getCurrentAdmin } from "@/lib/session";
import Package from "@/models/Package";
import { readPackage } from "@/lib/packages";

export const maxDuration = 30;

// Edit a package, or just publish/hide it ({ published: true|false }).
export async function PATCH(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

    const b = await req.json().catch(() => ({}));
    const update = {};
    if (typeof b.published === "boolean") update.published = b.published;
    if (b.name !== undefined) {
      const { pkg, error } = readPackage(b);
      if (error) return NextResponse.json({ error }, { status: 400 });
      Object.assign(update, pkg);
    }
    if (!Object.keys(update).length) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

    await dbConnect();
    const done = await Package.findByIdAndUpdate(id, update);
    if (!done) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin package update error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

    await dbConnect();
    await Package.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin package delete error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
