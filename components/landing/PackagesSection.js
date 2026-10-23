import Link from "next/link";
import Reveal from "./Reveal";

const fmt = (n) => Number(n).toLocaleString("en-US");

function RewardCard({ p }) {
  return (
    <div className="card flex h-full flex-col overflow-hidden transition hover:border-gold/60">
      <div className="bg-[var(--color-gold)]/80 px-6 py-5 text-center">
        <p className="text-xl font-semibold uppercase tracking-wide text-[#04120c]">Smart Assets</p>
        <p className="text-2xl uppercase tracking-wide text-[#04120c]/80">Rewards</p>
      </div>
      <div className="flex flex-1 flex-col p-7 text-center">
        <p className="text-xl text-amber-400">★</p>
        <h3 className="mt-3 text-xl font-semibold uppercase text-white">{p.name}</h3>
        <hr className="my-5 border-line" />
        <div className="space-y-2 text-sm text-white">
          {p.benefits.map((b, j) => (
            <p key={j}>{b}</p>
          ))}
        </div>
        <hr className="my-5 border-line" />
        <div className="mt-auto">
          <Link href="/register" className="btn-gold inline-block px-8">
            Select plan
          </Link>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ p }) {
  return (
    <div className="card flex h-full flex-col overflow-hidden transition hover:border-gold/60">
      <div className="bg-[var(--color-gold)] px-6 py-5 text-center">
        <h3 className="text-2xl font-semibold uppercase tracking-wide text-[#04120c]">{p.name}</h3>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <p className="text-center text-xl text-amber-400">★</p>
        <hr className="my-4 border-line" />
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-white">
          {p.benefits.map((b, j) => (
            <li key={j}>{b}</li>
          ))}
        </ol>
        <hr className="my-5 border-line" />
        <div className="mt-auto text-center">
          <p className="text-2xl font-semibold text-white">${fmt(p.price)}</p>
          <p className="text-lg font-semibold text-white">{p.maxLabel}</p>
          <Link href="/register" className="btn-gold mt-5 inline-block px-8">
            Select package
          </Link>
        </div>
      </div>
    </div>
  );
}

function Group({ title, items, Card }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-12 first:mt-0">
      <h2 className="text-center font-display text-3xl text-white md:text-4xl">{title}</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className="h-full">
            <Card p={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// Rewards and ambassador packages published from the admin panel. Hidden when there are none.
export default function PackagesSection({ packages }) {
  if (!packages || packages.length === 0) return null;
  const rewards = packages.filter((p) => p.kind === "reward");
  const ambassador = packages.filter((p) => p.kind !== "reward");

  return (
    <section id="packages" className="pb-20">
      <div className="mx-auto max-w-6xl px-4">
        <Group title="Rewards" items={rewards} Card={RewardCard} />
        <Group title="Ambassador packages" items={ambassador} Card={PackageCard} />
      </div>
    </section>
  );
}
