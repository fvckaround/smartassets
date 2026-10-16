import { money } from "@/lib/session";
import { targetPayout } from "@/lib/settle";

const DAY = 24 * 60 * 60 * 1000;

const dateFmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function timeLeft(endsAt) {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "Finishing up";
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h left`;
  const mins = Math.floor((ms % (60 * 60 * 1000)) / 60000);
  return `${hours}h ${mins}m left`;
}

function progress(inv) {
  const start = new Date(inv.startsAt).getTime();
  const end = new Date(inv.endsAt).getTime();
  if (end <= start) return 100;
  return Math.min(100, Math.max(0, Math.round(((Date.now() - start) / (end - start)) * 100)));
}

// Shows the logged-in user's ongoing plans (and finished ones below) under the plan list.
export default function MyPlans({ active, finished }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold text-white">Your ongoing plans</h2>
      <p className="mt-1 text-sm text-mist">
        Plans you have subscribed to. The payout is added to your balance automatically when the term ends.
      </p>

      {active.length === 0 ? (
        <p className="card mt-5 p-6 text-sm text-mist">
          You have no ongoing plans yet. Choose a plan above to get started.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {active.map((inv) => {
            const pct = progress(inv);
            return (
              <div key={inv._id.toString()} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-medium text-white">{inv.planName}</p>
                    <p className="text-xs text-mist">
                      {inv.targetReturnPercent}% target · {inv.durationDays} days
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-300">
                    Active
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-mist">Invested</p>
                    <p className="text-white">{money(inv.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-mist">Target payout</p>
                    <p className="gold-text font-medium">{money(targetPayout(inv))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-mist">Started</p>
                    <p className="text-white">{dateFmt(inv.startsAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-mist">Ends</p>
                    <p className="text-white">{dateFmt(inv.endsAt)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-mist">
                    <span>{pct}% complete</span>
                    <span>{timeLeft(inv.endsAt)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {finished.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-white">Completed plans</h3>
          <div className="card mt-3 divide-y divide-[var(--color-line)]">
            {finished.map((inv) => (
              <div key={inv._id.toString()} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                <div>
                  <p className="text-white">{inv.planName}</p>
                  <p className="text-xs text-mist">
                    {dateFmt(inv.startsAt)} – {dateFmt(inv.endsAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-mist">Invested {money(inv.amount)}</p>
                  <p className="text-white">
                    {inv.status === "settled" ? `Paid ${money(inv.payoutAmount)}` : "Cancelled"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}