import Loan from "@/models/Loan";
import { getCurrentUser, money } from "@/lib/session";
import { LOAN_MIN, LOAN_MAX, LOAN_TERMS } from "@/lib/loans";
import LoanForm from "./LoanForm";

export const metadata = { title: "Loans" };
export const dynamic = "force-dynamic";

const dateFmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const badge = {
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  declined: "border-red-400/40 bg-red-400/10 text-red-300",
};

export default async function LoansPage() {
  const user = await getCurrentUser();
  const loans = await Loan.find({ user: user._id }).sort({ createdAt: -1 }).lean();
  const hasPending = loans.some((l) => l.status === "pending");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-white">Loans</h1>
      <p className="mt-1 text-sm text-mist">
        Apply for a loan between {money(LOAN_MIN)} and {money(LOAN_MAX)}. Our team reviews every application and
        emails you the decision. If approved, the amount is added to your balance.
      </p>

      <LoanForm min={LOAN_MIN} max={LOAN_MAX} terms={LOAN_TERMS} hasPending={hasPending} />

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Your applications</h2>
        {loans.length === 0 ? (
          <p className="card mt-4 p-6 text-sm text-mist">You have not applied for a loan yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {loans.map((l) => (
              <div key={l._id.toString()} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-medium text-white">{money(l.amount)}</p>
                    <p className="text-xs text-mist">
                      {l.durationDays} days · applied {dateFmt(l.createdAt)}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs capitalize ${badge[l.status] || ""}`}>
                    {l.status === "pending" ? "Under review" : l.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-mist">
                  <span className="text-white">Purpose:</span> {l.purpose}
                </p>
                {l.status === "approved" && l.dueAt && (
                  <p className="mt-2 text-sm text-mist">
                    <span className="text-white">Repayment due:</span> {dateFmt(l.dueAt)}
                  </p>
                )}
                {l.adminNote && (
                  <div className="mt-3 rounded-lg border-l-2 border-[var(--color-gold)] bg-white/5 px-4 py-3 text-sm">
                    <p className="text-xs uppercase tracking-widest text-mist">Reason from our team</p>
                    <p className="mt-1 text-white">{l.adminNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
