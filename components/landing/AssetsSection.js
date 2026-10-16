import Reveal from "./Reveal";

const assets = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin network",
    text: "The original cryptocurrency. Send BTC only to the Bitcoin address shown on the deposit page.",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum network",
    text: "Send ETH on the Ethereum network to the address shown on the deposit page.",
  },
  {
    name: "Tether",
    symbol: "USDT",
    network: "TRON (TRC20)",
    text: "A dollar-pegged stablecoin. Send USDT on the TRC20 network only. Other networks can result in lost funds.",
  },
];

export default function AssetsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">Supported assets</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-white md:text-4xl">
            Fund your account with crypto
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-mist">
            Always double-check the address and network before sending. Crypto transfers cannot be reversed.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {assets.map((a, i) => (
            <Reveal key={a.symbol} delay={i * 0.08} className="h-full">
              <div className="card h-full p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-white">{a.name}</h3>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-gold">{a.symbol}</span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-wider text-mist">Network: {a.network}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}