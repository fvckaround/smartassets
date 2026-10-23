import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";
import { money } from "@/lib/session";
import { PlanForm, PlanActions } from "@/components/AdminClient";

export const metadata = { title: "Plans" };
export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  await dbConnect();
  const plans = await Plan.find().sort({ minAmount: 1 }).lean();

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl text-white">Investment plans</h1>
      <p className="mt-1 text-sm text-[var(--color-mist)]">
        Plans published here appear on the public site and in user dashboards. Returns are targets, so word
        descriptions accordingly and avoid promising guaranteed profit.
      </p>

      <div className="card mt-8 overflow-x-auto">
        {plans.length === 0 ? (
          <p className="p-6 text-sm text-[var(--color-mist)]">No plans yet. Create the first one below.</p>
        ) : (
          <table className="stack w-full text-left text-sm xl:min-w-[700px]">
            <thead className="text-[var(--color-mist)]">
              <tr className="border-b border-[var(--color-line)]">
                <th className="p-4 font-normal">Name</th>
                <th className="p-4 font-normal">Range</th>
                <th className="p-4 font-normal">Target</th>
                <th className="p-4 font-normal">Duration</th>
                <th className="p-4 font-normal">Risk</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p._id.toString()} className="border-b border-[var(--color-line)]/60 last:border-0">
                  <td data-label="Plan" className="full p-4 text-white">
                    {p.name}
                  </td>
                  <td data-label="Range" className="full p-4">
                    {money(p.minAmount)} - {p.maxAmount == null ? "Unlimited" : money(p.maxAmount)}
                  </td>
                  <td data-label="Target" className="p-4">
                    {p.targetReturnPercent}%
                  </td>
                  <td data-label="Duration" className="p-4">
                    {p.durationDays} days
                  </td>
                  <td data-label="Risk" className="p-4">
                    {p.riskLevel}
                  </td>
                  <td
                    data-label="Status"
                    className={`p-4 ${p.active ? "text-emerald-300" : "text-[var(--color-mist)]"}`}
                  >
                    {p.active ? "Active" : "Inactive"}
                  </td>
                  <td className="full p-4">
                    <PlanActions
                      plan={{
                        id: p._id.toString(),
                        name: p.name,
                        description: p.description || "",
                        minAmount: p.minAmount,
                        maxAmount: p.maxAmount,
                        targetReturnPercent: p.targetReturnPercent,
                        durationDays: p.durationDays,
                        riskLevel: p.riskLevel,
                        active: p.active,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="mt-10 font-display text-xl text-white">Create a plan</h2>
      <div className="mt-4">
        <PlanForm />
      </div>
    </div>
  );
}