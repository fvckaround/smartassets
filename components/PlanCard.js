// One investment plan card, used on the landing page and on the user's Invest page.
// The daily figure is the plan's total target return spread over its duration
// (e.g. 228% over 60 days = 3.8% daily). The payout at the end is the total + the capital.

const fmt = (n) => Number(n).toLocaleString("en-US");
const pct = (n) => Number(Number(n).toFixed(2)).toString();

export function durationLabel(days) {
  const d = Number(days);
  if (d >= 30 && d % 30 === 0) {
    const m = d / 30;
    return `${m} ${m === 1 ? "Month" : "Months"}`;
  }
  return `${d} ${d === 1 ? "Day" : "Days"}`;
}

export default function PlanCard({ plan, action, selected = false, referralPercent }) {
  const daily = plan.durationDays > 0 ? plan.targetReturnPercent / plan.durationDays : 0;

  return (
    <div
      className={`card flex h-full flex-col overflow-hidden text-center transition ${
        selected ? "!border-gold ring-1 ring-[var(--color-gold)]" : "hover:border-gold/60"
      }`}
    >
      <div className="bg-[var(--color-gold)] px-5 py-6">
        <h3 className="text-2xl font-bold uppercase tracking-wide text-[#04120c] md:text-3xl">{plan.name}</h3>
        <p className="mt-2 text-3xl text-[#04120c] md:text-4xl">{pct(daily)}% Daily</p>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
        <p className="text-xl text-amber-400">★</p>
        <p className="mt-3 text-xl font-bold text-white md:text-2xl">Duration: {durationLabel(plan.durationDays)}</p>

        {plan.description ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-mist">{plan.description}</p>
        ) : null}

        <hr className="my-5 border-white/70" />

        <p className="text-white">Total: {pct(plan.targetReturnPercent)}%</p>
        <p className="mt-3 text-white">+Capital Return</p>
        {referralPercent ? <p className="mt-3 text-sm text-gold">Referral bonus: {referralPercent}%</p> : null}

        <hr className="my-5 border-white/70" />

        <div className="mt-auto">
          <p className="text-xl font-bold text-white md:text-2xl">Minimum:&nbsp;&nbsp;${fmt(plan.minAmount)}</p>
          <p className="mt-1 text-xl font-bold text-white md:text-2xl">
            Maximum:&nbsp;&nbsp;{plan.maxAmount == null ? "Unlimited" : `$${fmt(plan.maxAmount)}`}
          </p>
          <div className="mt-5">{action}</div>
        </div>
      </div>
    </div>
  );
}
