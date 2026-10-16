import Plan from "@/models/Plan";
import Investment from "@/models/Investment";
import { getCurrentUser, money } from "@/lib/session";
import { settleDue } from "@/lib/settle";
import InvestForm from "./InvestForm";
import MyPlans from "./MyPlans";

export const metadata = { title: "Invest" };
export const dynamic = "force-dynamic";

export default async function InvestPage() {
  // Pay out any of this user's plans that have ended, so the lists below are current.
  const first = await getCurrentUser();
  if (first) {
    try {
      await settleDue({ userId: first._id, limit: 50 });
    } catch (err) {
      console.error("invest settle error:", err);
    }
  }

  const user = await getCurrentUser();
  const [plans, mine] = await Promise.all([
    Plan.find({ active: true }).sort({ minAmount: 1 }).lean(),
    Investment.find({ user: user._id }).sort({ endsAt: 1 }).lean(),
  ]);

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

  const active = mine.filter((i) => i.status === "active");
  const finished = mine
    .filter((i) => i.status !== "active")
    .sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt))
    .slice(0, 10);

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

      <MyPlans active={active} finished={finished} />
    </div>
  );
}