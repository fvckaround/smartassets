import Plan from "@/models/Plan";
import { getCurrentUser, money } from "@/lib/session";
import InvestForm from "./InvestForm";

export const metadata = { title: "Invest" };
export const dynamic = "force-dynamic";

export default async function InvestPage() {
  const user = await getCurrentUser();
  const plans = await Plan.find({ active: true }).sort({ minAmount: 1 }).lean();

  const serialized = plans.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    minAmount: p.minAmount,
    maxAmount: p.maxAmount,
    targetReturnPercent: p.targetReturnPercent,
    durationDays: p.durationDays,
    riskLevel: p.riskLevel,
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-white">Invest</h1>
      <p className="mt-1 text-sm text-mist">
        Available balance: <span className="text-white">{money(user.balance)}</span>. Target returns are not
        guaranteed and your capital is at risk.
      </p>

      {serialized.length === 0 ? (
        <p className="card mt-8 p-6 text-sm text-mist">No plans are available right now.</p>
      ) : (
        <InvestForm plans={serialized} balance={user.balance} />
      )}
    </div>
  );
}