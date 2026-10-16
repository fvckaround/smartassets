import dbConnect from "@/lib/db";
import { money } from "@/lib/session";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Investment from "@/models/Investment";
import { TxActions } from "@/components/AdminClient";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await dbConnect();
  const [userCount, pending, recent, activeInv] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Transaction.find({ status: "pending" }).sort({ createdAt: 1 }).populate("user", "name email").lean(),
    Transaction.find({ status: { $ne: "pending" } })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .lean(),
    Investment.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
  ]);

  const inv = activeInv[0] || { total: 0, count: 0 };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold text-white">Admin overview</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-mist">Registered users</p>
          <p className="mt-2 text-3xl font-semibold text-white">{userCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-mist">Active investments</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {inv.count} <span className="text-base text-mist">({money(inv.total)})</span>
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-mist">Awaiting review</p>
          <p className="gold-text mt-2 text-3xl font-semibold">{pending.length}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Pending deposits and withdrawals</h2>
        <p className="mt-1 text-xs text-mist">
          Verify deposits on the blockchain before approving. Approving a deposit credits the user. Rejecting a
          withdrawal returns the held funds. For an approved withdrawal, send the funds to the address shown yourself.
        </p>
        <div className="card mt-4 overflow-x-auto">
          {pending.length === 0 ? (
            <p className="p-6 text-sm text-mist">Nothing pending.</p>
          ) : (
            <table className="stack w-full text-left text-sm xl:min-w-[820px]">
              <thead className="text-mist">
                <tr className="border-b border-line">
                  <th className="p-4 font-normal">Date</th>
                  <th className="p-4 font-normal">User</th>
                  <th className="p-4 font-normal">Type</th>
                  <th className="p-4 font-normal">Amount</th>
                  <th className="p-4 font-normal">Method</th>
                  <th className="p-4 font-normal">Hash / address</th>
                  <th className="p-4 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((t) => (
                  <tr key={t._id.toString()} className="border-b border-line/60 align-top last:border-0">
                    <td data-label="Date" className="p-4">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td data-label="User" className="p-4">
                      <div className="text-white">{t.user?.name}</div>
                      <div className="break-all text-xs text-mist">{t.user?.email}</div>
                    </td>
                    <td data-label="Type" className="p-4 capitalize text-white">
                      {t.type}
                    </td>
                    <td data-label="Amount" className="p-4">
                      {money(t.amount)}
                    </td>
                    <td data-label="Method" className="p-4">
                      {t.method}
                    </td>
                    <td data-label="Hash / address" className="full max-w-[220px] break-all p-4 text-xs">
                      {t.reference}
                    </td>
                    <td className="full p-4">
                      <TxActions id={t._id.toString()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Recently reviewed</h2>
        <div className="card mt-4 overflow-x-auto">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-mist">No reviewed transactions yet.</p>
          ) : (
            <table className="stack w-full text-left text-sm xl:min-w-[620px]">
              <tbody>
                {recent.map((t) => (
                  <tr key={t._id.toString()} className="border-b border-line/60 last:border-0">
                    <td data-label="Date" className="p-4">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </td>
                    <td data-label="User" className="p-4 text-white">
                      {t.user?.email}
                    </td>
                    <td data-label="Type" className="p-4 capitalize">
                      {t.type}
                    </td>
                    <td data-label="Amount" className="p-4">
                      {money(t.amount)}
                    </td>
                    <td
                      data-label="Status"
                      className={`p-4 capitalize ${t.status === "approved" ? "text-gold" : "text-red-300"}`}
                    >
                      {t.status}
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