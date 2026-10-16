import { NextResponse } from "next/server";

export const maxDuration = 30;

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h";

// Proxy + cache so the browser never hits CoinGecko directly (avoids CORS and rate limits).
export async function GET() {
  try {
    const res = await fetch(COINGECKO_URL, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
    const data = await res.json();

    const coins = data.map((c) => ({
      id: c.id,
      symbol: String(c.symbol || "").toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      change24h: c.price_change_percentage_24h,
      marketCap: c.market_cap,
      volume: c.total_volume,
      // 7 days of hourly points, thinned to ~28 for a small sparkline
      spark: (c.sparkline_in_7d?.price || []).filter((_, i) => i % 6 === 0),
    }));

    return NextResponse.json(
      { coins, updatedAt: Date.now() },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    console.error("markets error:", err);
    return NextResponse.json({ coins: [], error: true }, { status: 502 });
  }
}