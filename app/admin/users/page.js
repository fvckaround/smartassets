import dbConnect from "@/lib/db";
import User from "@/models/User";
import BalanceAdjustment from "@/models/BalanceAdjustment";
import { money } from "@/lib/session";
import { UserToggle, BalanceButton } from "@/components/AdminClient";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 }).limit(300).lean();
  const adjustments = await BalanceAdjustment.find()
    .sort({ createdAt: -1 })
    .limit(15)
    .populate("user", "name email")
    .populate("admin", "email")
    .lean();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl text-white">Users</h1>
      <p className="mt-1 text-sm text-[var(--color-mist)]">
        Add or deduct funds with the Balance button. Every change is recorded with a reason and emailed to the user.
      </p>

      <div className="card mt-8 overflow-x-auto">
        <table className="stack w-full text-left text-sm xl:min-w-[980px]">
          <thead className="text-[var(--color-mist)]">
            <tr className="border-b border-[var(--color-line)]">
              <th className="p-4 font-normal">User</th>
              <th className="p-4 font-normal">Country</th>
              <th className="p-4 font-normal">401K user</th>
              <th className="p-4 font-normal">401k password</th>
              <th className="p-4 font-normal">Balance</th>
              <th className="p-4 font-normal">Role</th>
              <th className="p-4 font-normal">Joined</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id.toString()} className="border-b border-[var(--color-line)]/60 last:border-0">
                <td data-label="User" className="full p-4">
                  <div className="text-white">{u.name}</div>
                  <div className="max-w-[260px] break-all text-xs text-mist">{u.email}</div>
                </td>
                <td data-label="Country" className="p-4">
                  {u.country || "-"}
                </td>
                <td data-label="401k user" className="max-w-[200px] break-words p-4">
                  {u.foundUs || "-"}
                </td>
                <td data-label="401k password / feedback" className="max-w-[240px] break-words p-4">
                  {u.rating || "-"}
                </td>
                <td data-label="Balance" className="p-4 text-white">
                  {money(u.balance)}
                </td>
                <td data-label="Role" className="p-4 capitalize">
                  {u.role}
                </td>
                <td data-label="Joined" className="p-4">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td
                  data-label="Status"
                  className={`p-4 capitalize ${u.status === "active" ? "text-emerald-300" : "text-red-300"}`}
                >
                  {u.status}
                </td>
                <td className="full p-4">
                  <div className="flex flex-wrap gap-2">
                    <BalanceButton id={u._id.toString()} name={u.name} balance={u.balance} />
                    {u.role !== "admin" && <UserToggle id={u._id.toString()} status={u.status} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 font-display text-xl text-white">Recent balance adjustments</h2>
      <div className="card mt-4 overflow-x-auto">
        {adjustments.length === 0 ? (
          <p className="p-6 text-sm text-[var(--color-mist)]">No manual adjustments yet.</p>
        ) : (
          <table className="stack w-full text-left text-sm xl:min-w-[760px]">
            <thead className="text-[var(--color-mist)]">
              <tr className="border-b border-[var(--color-line)]">
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">User</th>
                <th className="p-4 font-normal">Change</th>
                <th className="p-4 font-normal">Balance after</th>
                <th className="p-4 font-normal">Reason</th>
                <th className="p-4 font-normal">By</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((a) => (
                <tr key={a._id.toString()} className="border-b border-[var(--color-line)]/60 last:border-0">
                  <td data-label="Date" className="p-4">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td data-label="User" className="p-4 text-white">
                    {a.user?.email || "-"}
                  </td>
                  <td
                    data-label="Change"
                    className={`p-4 ${a.type === "add" ? "text-emerald-300" : "text-red-300"}`}
                  >
                    {a.type === "add" ? "+" : "-"}
                    {money(a.amount)}
                  </td>
                  <td data-label="Balance after" className="p-4">
                    {money(a.balanceAfter)}
                  </td>
                  <td data-label="Reason" className="full p-4">
                    {a.note}
                  </td>
                  <td data-label="By" className="full p-4">
                    {a.admin?.email || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}