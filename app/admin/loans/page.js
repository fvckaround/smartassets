import dbConnect from "@/lib/db";
import Loan from "@/models/Loan";
import "@/models/User";
import { money } from "@/lib/session";
import { LoanActions } from "@/components/LoanAdmin";

export const metadata = { title: "Loans" };
export const dynamic = "force-dynamic";

const dateFmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const badge = {
  approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  declined: "border-red-400/40 bg-red-400/10 text-red-300",
};

export default async function AdminLoansPage() {
  await dbConnect();
  const [pending, reviewed] = await Promise.all([
    Loan.find({ status: "pending" }).sort({ createdAt: 1 }).populate("user", "name email balance").lean(),
    Loan.find({ status: { $ne: "pending" } })
      .sort({ reviewedAt: -1 })
      .limit(30)
      .populate("user", "name email")
      .lean(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold text-white">Loan applications</h1>
      <p className="mt-1 text-sm text-mist">
        Approve or decline each application and give a reason; the user sees it in their dashboard and by email.
        Approving adds the loan amount to the user&apos;s balance.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white">
          Pending <span className="text-mist">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <p className="card mt-4 p-6 text-sm text-mist">No loan applications waiting for review.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {pending.map((l) => (
              <div key={l._id.toString()} className="card grid gap-5 p-5 md:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <p className="text-2xl font-semibold text-white">{money(l.amount)}</p>
                  <p className="text-mist">
                    {l.durationDays} days · applied {dateFmt(l.createdAt)}
                  </p>
                  <p>
                    <span className="text-mist">User: </span>
                    <span className="text-white">{l.user?.name}</span>
                    <span className="block break-all text-xs text-mist">{l.user?.email}</span>
                  </p>
                  <p>
                    <span className="text-mist">Current balance: </span>
                    <span className="text-white">{money(l.user?.balance)}</span>
                  </p>
                  <p className="break-words">
                    <span className="text-mist">Purpose: </span>
                    <span className="text-white">{l.purpose}</span>
                  </p>
                </div>
                <LoanActions id={l._id.toString()} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">Recently reviewed</h2>
        {reviewed.length === 0 ? (
          <p className="card mt-4 p-6 text-sm text-mist">No reviewed loans yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {reviewed.map((l) => (
              <div key={l._id.toString()} className="card p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-white">
                      {money(l.amount)} · {l.durationDays} days
                    </p>
                    <p className="break-all text-xs text-mist">
                      {l.user?.name} ({l.user?.email}) · {l.reviewedAt ? dateFmt(l.reviewedAt) : ""}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs capitalize ${badge[l.status] || ""}`}>
                    {l.status}
                  </span>
                </div>
                {l.adminNote && <p className="mt-2 break-words text-mist">Reason: {l.adminNote}</p>}
                {l.status === "approved" && l.dueAt && (
                  <p className="mt-1 text-mist">Repayment due: {dateFmt(l.dueAt)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
