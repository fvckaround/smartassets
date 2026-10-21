import Link from "next/link";
import Reveal from "./Reveal";

const fmt = (n) => Number(n).toLocaleString("en-US");

export default function PlansSection({ plans }) {
  return (
    <section id="plans" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-display text-3xl text-white md:text-4xl">Investment plans</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-mist">
          Figures below are target returns over the full plan duration. They are guaranteed and your capital is at
          safe.
        </p>

        {plans.length === 0 ? (
          <p className="card mx-auto mt-12 max-w-xl p-8 text-center text-mist">
            Plans are being finalised and will be published here soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} className="h-full">
                <div className="card flex h-full flex-col p-7 transition hover:border-gold/60">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl text-white">{p.name}</h3>
                    <span className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-gold">
                      {p.riskLevel} risk
                    </span>
                  </div>

                  <p className="mt-2 min-h-[40px] text-sm text-mist">{p.description}</p>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="gold-text font-display text-4xl">{p.targetReturnPercent}%</span>
                    <span className="text-sm text-mist">target over {p.durationDays} days</span>
                  </div>

                  <dl className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-mist">Minimum</dt>
                      <dd className="text-white">${fmt(p.minAmount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mist">Maximum</dt>
                      <dd className="text-white">${fmt(p.maxAmount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mist">Duration</dt>
                      <dd className="text-white">{p.durationDays} days</dd>
                    </div>
                  </dl>

                  <Link href="/register" className="btn-gold mt-auto pt-0 text-center">
                    <span className="block py-0">Get started</span>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}