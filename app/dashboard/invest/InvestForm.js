"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlanCard from "@/components/PlanCard";

const fmt = (n) => Number(n).toLocaleString("en-US");

export default function InvestForm({ plans, balance }) {
  const router = useRouter();
  const [planId, setPlanId] = useState(plans[0].id);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = plans.find((p) => p.id === planId);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setDone("");
    setLoading(true);
    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, amount: Number(amount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start investment.");
      } else {
        setDone("Investment started. You can follow it on your overview page.");
        setAmount("");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            selected={p.id === planId}
            action={
              <button
                type="button"
                onClick={() => setPlanId(p.id)}
                className={p.id === planId ? "btn-ghost px-8" : "btn-gold px-8"}
              >
                {p.id === planId ? "Selected" : "Select Plan"}
              </button>
            }
          />
        ))}
      </div>

      <form onSubmit={onSubmit} className="card h-fit space-y-4 p-6 lg:sticky lg:top-6 lg:col-span-2">
        <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
        <div>
          <label className="mb-1.5 block text-sm text-mist">Amount (USD)</label>
          <input
            type="number"
            step="any"
            required
            min={plan.minAmount}
            max={plan.maxAmount ?? undefined}
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={
              plan.maxAmount == null
                ? `$${fmt(plan.minAmount)} or more`
                : `$${fmt(plan.minAmount)} - $${fmt(plan.maxAmount)}`
            }
          />
          <p className="mt-1.5 text-xs text-mist">Balance: ${fmt(balance)}</p>
        </div>
        <p className="text-xs leading-relaxed text-mist">
          The {plan.targetReturnPercent}% figure is a target, not a guarantee. You may receive less than you invest.
        </p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {done && <p className="text-sm text-gold">{done}</p>}
        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? "Processing..." : "Start investment"}
        </button>
      </form>
    </div>
  );
}