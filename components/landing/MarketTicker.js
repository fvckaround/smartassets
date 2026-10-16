"use client";

import useMarkets from "./useMarkets";

const price = (n) =>
  n == null ? "-" : n >= 1 ? n.toLocaleString("en-US", { style: "currency", currency: "USD" }) : `$${n.toPrecision(4)}`;

export default function MarketTicker() {
  const { coins } = useMarkets();
  if (!coins.length) return null;

  const items = coins.slice(0, 12);
  const row = [...items, ...items]; // duplicated so the loop is seamless

  return (
    <div className="overflow-hidden border-y border-line bg-navy" aria-label="Live crypto prices">
      <style>{`@keyframes sa-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div className="flex w-max py-3 text-sm" style={{ animation: "sa-ticker 50s linear infinite" }}>
        {row.map((c, i) => {
          const up = (c.change24h ?? 0) >= 0;
          return (
            <div key={`${c.id}-${i}`} className="flex items-center gap-2 pr-10">
              <span className="font-medium text-white">{c.symbol}</span>
              <span className="text-mist">{price(c.price)}</span>
              <span className={up ? "text-gold" : "text-red-400"}>
                {c.change24h == null ? "-" : `${up ? "+" : ""}${c.change24h.toFixed(2)}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}