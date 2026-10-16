import dbConnect from "@/lib/db";
import Investment from "@/models/Investment";
import "@/models/User";
import { money } from "@/lib/session";
import { SettleForm } from "@/components/AdminClient";

export const metadata = { title: "Investments" };
export const dynamic = "force-dynamic";

export default async function AdminInvestmentsPage() {
  await dbConnect();
  const investments = await Investment.find()
    .sort({ status: 1, endsAt: 1 })
    .populate("user", "name email")
    .limit(200)
    .lean();

  const now = Date.now();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-semibold text-white">Investments</h1>
      <p className="mt-1 text-sm text-mist">
        Settle an investment when its term ends by recording the actual payout. The payout is credited to the
        investor&apos;s balance and can be less than, equal to, or more than the amount invested.
      </p>

      <div className="card mt-8 overflow-x-auto">
        {investments.length === 0 ? (
          <p className="p-6 text-sm text-mist">No investments yet.</p>
        ) : (
          <table className="stack w-full text-left text-sm xl:min-w-[860px]">
            <thead className="text-mist">
              <tr className="border-b border-line">
                <th className="p-4 font-normal">Investor</th>
                <th className="p-4 font-normal">Plan</th>
                <th className="p-4 font-normal">Amount</th>
                <th className="p-4 font-normal">Target</th>
                <th className="p-4 font-normal">Ends</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Settle</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((i) => {
                const due = i.status === "active" && new Date(i.endsAt).getTime() <= now;
                return (
                  <tr key={i._id.toString()} className="border-b border-line/60 last:border-0">
                    <td data-label="Investor" className="full p-4">
                      <div className="text-white">{i.user?.name}</div>
                      <div className="break-all text-xs text-mist">{i.user?.email}</div>
                    </td>
                    <td data-label="Plan" className="p-4">
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
                      {due && <span className="ml-2 text-xs text-yellow-300">due</span>}
                    </td>
                    <td data-label="Status" className="p-4 capitalize">
                      {i.status}
                    </td>
                    <td data-label="Settle" className="full p-4">
                      {i.status === "active" ? (
                        <SettleForm id={i._id.toString()} amount={i.amount} />
                      ) : i.status === "settled" ? (
                        <span>Paid {money(i.payoutAmount)}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}