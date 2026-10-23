"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoanForm({ min, max, terms, hasPending }) {
  const router = useRouter();
  const [v, setV] = useState({ amount: "", durationDays: String(terms[0]), purpose: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(v.amount), durationDays: Number(v.durationDays), purpose: v.purpose }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ type: "error", text: data.error || "Could not submit your application." });
      } else {
        setMsg({ type: "ok", text: "Application submitted. We will email you once it has been reviewed." });
        setV({ amount: "", durationDays: String(terms[0]), purpose: "" });
        router.refresh();
      }
    } catch {
      setMsg({ type: "error", text: "Network error. Please try again." });
    }
    setBusy(false);
  }

  if (hasPending && msg.type !== "ok") {
    return (
      <div className="card mt-8 p-6 text-sm text-mist">
        You have a loan application under review. You can apply again once it has been decided.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mt-8 space-y-4 p-6">
      <h2 className="text-lg font-medium text-white">Apply for a loan</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-mist">Amount (USD)</label>
          <input
            type="number"
            className="input"
            required
            min={min}
            max={max}
            step="0.01"
            value={v.amount}
            onChange={set("amount")}
            placeholder={`${min.toLocaleString()} - ${max.toLocaleString()}`}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-mist">Loan term</label>
          <select className="input" value={v.durationDays} onChange={set("durationDays")}>
            {terms.map((t) => (
              <option key={t} value={t} className="bg-panel">
                {t} days
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-mist">What is the loan for?</label>
        <textarea
          className="input min-h-[100px]"
          required
          minLength={10}
          maxLength={500}
          value={v.purpose}
          onChange={set("purpose")}
          placeholder="Briefly describe what you need the loan for."
        />
      </div>
      {msg.text && <p className={`text-sm ${msg.type === "ok" ? "text-emerald-300" : "text-red-400"}`}>{msg.text}</p>}
      <button className="btn-gold" disabled={busy}>
        {busy ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
