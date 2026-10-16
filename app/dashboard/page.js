import Link from "next/link";
import { getCurrentUser, money } from "@/lib/session";
import Investment from "@/models/Investment";
import Transaction from "@/models/Transaction";
import { settleDue } from "@/lib/settle";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const statusStyle = {
  pending: "text-yellow-300 border-yellow-300/30",
  approved: "text-gold border-gold/30",
  rejected: "text-red-300 border-red-300/30",
  active: "text-sky-300 border-sky-300/30",
  settled: "text-gold border-gold/30",
  cancelled: "text-red-300 border-red-300/30",
};

function Pill({ s }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs capitalize ${statusStyle[s] || ""}`}>{s}</span>
  );
}

export default async function DashboardPage() {
  // Pay out any of this user's investments whose term has ended, then load fresh data.
  const first = await getCurrentUser();
  if (first) {
    try {
      await settleDue({ userId: first._id, limit: 50 });
    } catch (err) {
      console.error("dashboard settle error:", err);
    }
  }
  const user = await getCurrentUser();

  const [investments, transactions] = await Promise.all([
    Investment.find({ user: user._id }).sort({ createdAt: -1 }).lean(),
    Transaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(15).lean(),
  ]);

  const activeInvested = investments
    .filter((i) => i.status === "active")
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold text-white">Hello, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-mist">Here is a snapshot of your account.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-mist">Available balance</p>
          <p className="gold-text mt-2 text-3xl font-semibold">{money(user.balance)}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-mist">Currently invested</p>
          <p className="mt-2 text-3xl font-semibold text-white">{money(activeInvested)}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-mist">Pending requests</p>
          <p className="mt-2 text-3xl font-semibold text-white">{pendingCount}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/deposit" className="btn-gold text-sm">
          Deposit
        </Link>
        <Link href="/dashboard/invest" className="btn-ghost text-sm">
          Invest
        </Link>
        <Link href="/dashboard/withdraw" className="btn-ghost text-sm">
          Withdraw
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Your investments</h2>
        <div className="card mt-4 overflow-x-auto">
          {investments.length === 0 ? (
            <p className="p-6 text-sm text-mist">You have no investments yet.</p>
          ) : (
            <table className="stack w-full text-left text-sm xl:min-w-[560px]">
              <thead className="text-mist">
                <tr className="border-b border-line">
                  <th className="p-4 font-normal">Plan</th>
                  <th className="p-4 font-normal">Amount</th>
                  <th className="p-4 font-normal">Target</th>
                  <th className="p-4 font-normal">Ends</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal">Payout</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((i) => (
                  <tr key={i._id.toString()} className="border-b border-line/60 last:border-0">
                    <td data-label="Plan" className="full p-4 text-white">
                      {i.planName}
                    </td>
                    <td data-label="Amount" className="p-4">
                      {money(i.amount)}
                    </td>
                    <td data-label="Target" className="p-4">
                      {i.targetReturnPercent}%
                    </td>
                    <td data-label="Ends" className="p-4">
                      {new Date(i.endsAt).toLocaleDateString()}
                    </td>
                    <td data-label="Status" className="p-4">
                      <Pill s={i.status} />
                    </td>
                    <td data-label="Payout" className="p-4">
                      {i.status === "settled" ? money(i.payoutAmount) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Recent transactions</h2>
        <div className="card mt-4 overflow-x-auto">
          {transactions.length === 0 ? (
            <p className="p-6 text-sm text-mist">No transactions yet.</p>
          ) : (
            <table className="stack w-full text-left text-sm xl:min-w-[760px]">
              <thead className="text-mist">
                <tr className="border-b border-line">
                  <th className="p-4 font-normal">Date</th>
                  <th className="p-4 font-normal">Type</th>
                  <th className="p-4 font-normal">Method</th>
                  <th className="p-4 font-normal">Amount</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal">Note from our team</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id.toString()} className="border-b border-line/60 align-top last:border-0">
                    <td data-label="Date" className="p-4">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td data-label="Type" className="p-4 capitalize text-white">
                      {t.type}
                    </td>
                    <td data-label="Method" className="p-4">
                      {t.method}
                    </td>
                    <td data-label="Amount" className="p-4">
                      {money(t.amount)}
                    </td>
                    <td data-label="Status" className="p-4">
                      <Pill s={t.status} />
                      {t.reviewedAt && (
                        <div className="mt-1 text-xs text-mist">
                          Reviewed {new Date(t.reviewedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td data-label="Note from our team" className="full max-w-[260px] p-4 text-xs leading-relaxed">
                      {t.adminNote || null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}