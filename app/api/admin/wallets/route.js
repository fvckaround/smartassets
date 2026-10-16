import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/session";
import Wallet from "@/models/Wallet";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const b = await req.json();
    const wallet = {
      name: String(b.name || "").trim(),
      symbol: String(b.symbol || "").trim().toUpperCase(),
      network: String(b.network || "").trim(),
      address: String(b.address || "").trim(),
    };

    if (!wallet.name || !wallet.symbol) {
      return NextResponse.json({ error: "Coin name and symbol are required." }, { status: 400 });
    }
    if (wallet.address.length < 8) {
      return NextResponse.json({ error: "Enter a valid wallet address." }, { status: 400 });
    }

    await Wallet.create(wallet);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("admin wallet create error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}