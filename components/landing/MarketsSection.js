"use client";

import useMarkets from "./useMarkets";
import Reveal from "./Reveal";

const usd = (n) =>
  n == null ? "-" : n >= 1 ? n.toLocaleString("en-US", { style: "currency", currency: "USD" }) : `$${n.toPrecision(4)}`;

const compact = (n) =>
  n == null ? "-" : `$${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n)}`;

function Spark({ data, up }) {
  if (!data || data.length < 2) return null;
  const w = 100;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-24" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "#1fd18a" : "#f87171"}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function MarketsSection() {
  const { coins, loading, error, updatedAt } = useMarkets();

  return (
    <section id="markets" className="border-y border-line bg-navy/60 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">Live markets</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-white md:text-4xl">
            Top 20 cryptocurrencies by market cap
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-mist">
            Prices refresh automatically every minute. Market data is for information only and is not a
            recommendation to buy or sell.
          </p>
        </Reveal>

        <div className="card mt-10 overflow-x-auto">
          {loading && coins.length === 0 ? (
            <p className="p-8 text-center text-sm text-mist">Loading live prices...</p>
          ) : error ? (
            <p className="p-8 text-center text-sm text-mist">
              Live prices are temporarily unavailable. Please check back shortly.
            </p>
          ) : (
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-mist">
                <tr className="border-b border-line">
                  <th className="p-4 font-normal">#</th>
                  <th className="p-4 font-normal">Coin</th>
                  <th className="p-4 text-right font-normal">Price</th>
                  <th className="p-4 text-right font-normal">24h</th>
                  <th className="hidden p-4 text-right font-normal md:table-cell">Market cap</th>
                  <th className="hidden p-4 text-right font-normal md:table-cell">24h volume</th>
                  <th className="hidden p-4 text-right font-normal lg:table-cell">7 days</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((c, i) => {
                  const up = (c.change24h ?? 0) >= 0;
                  return (
                    <tr key={c.id} className="border-b border-line/60 last:border-0 hover:bg-white/[0.03]">
                      <td className="p-4 text-mist">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image} alt="" width="24" height="24" className="h-6 w-6 rounded-full" />
                          <span className="font-medium text-white">{c.name}</span>
                          <span className="text-xs text-mist">{c.symbol}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-white">{usd(c.price)}</td>
                      <td className={`p-4 text-right ${up ? "text-gold" : "text-red-400"}`}>
                        {c.change24h == null ? "-" : `${up ? "+" : ""}${c.change24h.toFixed(2)}%`}
                      </td>
                      <td className="hidden p-4 text-right text-mist md:table-cell">{compact(c.marketCap)}</td>
                      <td className="hidden p-4 text-right text-mist md:table-cell">{compact(c.volume)}</td>
                      <td className="hidden p-4 lg:table-cell">
                        <div className="flex justify-end">
                          <Spark data={c.spark} up={up} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-mist">
          Data provided by CoinGecko.
          {updatedAt ? ` Last updated ${new Date(updatedAt).toLocaleTimeString()}.` : ""}
        </p>
      </div>
    </section>
  );
}