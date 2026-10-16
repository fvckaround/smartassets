import Link from "next/link";
import Reveal from "./Reveal";

function Sample({ children, label }) {
  return (
    <div className="card p-6">
      {children}
      <p className="mt-5 border-t border-line pt-3 text-[11px] text-mist">{label}</p>
    </div>
  );
}

export default function ProductPreview() {
  return (
    <section className="border-y border-line bg-navy/60 py-20">
      <div className="mx-auto max-w-6xl space-y-24 px-4">
        {/* Row 1 */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Your dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              See your whole account at a glance
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Your balance, active investments and pending requests are on one page, with a full table of
              everything you have done. No spreadsheets and no guessing where your funds are.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-mist">
              <li>• Available balance and amount currently invested</li>
              <li>• Each investment with its plan, term end date and status</li>
              <li>• Deposit and withdrawal history with review status</li>
            </ul>
            <Link href="/register" className="btn-gold mt-7 inline-block">
              Create an account
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <Sample label="Illustrative example only. Not real account data.">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-ink/60 p-3">
                  <p className="text-[11px] text-mist">Available</p>
                  <p className="mt-1 font-semibold text-white">$2,450.00</p>
                </div>
                <div className="rounded-xl bg-ink/60 p-3">
                  <p className="text-[11px] text-mist">Invested</p>
                  <p className="mt-1 font-semibold text-white">$5,000.00</p>
                </div>
                <div className="rounded-xl bg-ink/60 p-3">
                  <p className="text-[11px] text-mist">Pending</p>
                  <p className="mt-1 font-semibold text-white">1</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {[
                  ["Deposit", "Approved", "text-gold"],
                  ["Investment", "Active", "text-sky-300"],
                  ["Withdrawal", "Pending", "text-yellow-300"],
                ].map(([t, s, c]) => (
                  <div key={t} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                    <span className="text-white">{t}</span>
                    <span className={c}>{s}</span>
                  </div>
                ))}
              </div>
            </Sample>
          </Reveal>
        </div>

        {/* Row 2 */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <Sample label="Illustrative example only. Not real account data.">
              <p className="text-sm font-medium text-white">Fund your account</p>
              <ol className="mt-4 space-y-3 text-sm">
                {[
                  "Choose BTC, ETH or USDT (TRC20)",
                  "Send to the address shown on the deposit page",
                  "Paste your transaction hash and submit",
                  "Balance is credited once the deposit is reviewed",
                ].map((s, i) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-semibold text-gold">
                      {i + 1}
                    </span>
                    <span className="text-mist">{s}</span>
                  </li>
                ))}
              </ol>
            </Sample>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Simple funding</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              Deposit with the crypto you already hold
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Fund your balance with Bitcoin, Ethereum or USDT. Every deposit is matched to its transaction hash and
              reviewed, so nothing is credited on a guess.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Withdrawals work the same way: request, review, then payout to the wallet address you provide.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}