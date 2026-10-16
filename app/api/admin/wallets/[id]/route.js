import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentAdmin } from "@/lib/session";
import Wallet from "@/models/Wallet";

export const maxDuration = 30;

export async function PATCH(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const b = await req.json();
    const update = {};

    if (typeof b.active === "boolean") update.active = b.active;
    if (typeof b.name === "string") update.name = b.name.trim();
    if (typeof b.symbol === "string") update.symbol = b.symbol.trim().toUpperCase();
    if (typeof b.network === "string") update.network = b.network.trim();
    if (typeof b.address === "string") update.address = b.address.trim();

    if ("name" in update && !update.name) {
      return NextResponse.json({ error: "Coin name is required." }, { status: 400 });
    }
    if ("symbol" in update && !update.symbol) {
      return NextResponse.json({ error: "Coin symbol is required." }, { status: 400 });
    }
    if ("address" in update && update.address.length < 8) {
      return NextResponse.json({ error: "Enter a valid wallet address." }, { status: 400 });
    }
    if (!Object.keys(update).length) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    await Wallet.updateOne({ _id: id }, update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin wallet patch error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    // Past transactions store the method as text, so deleting a wallet never breaks history.
    await Wallet.deleteOne({ _id: id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin wallet delete error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}