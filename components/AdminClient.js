"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function call(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: data.error };
}

export function TxActions({ id }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function act(action) {
    if (action === "reject" && !confirm("Reject this request?")) return;
    setBusy(true);
    setError("");
    const r = await call(`/api/admin/transactions/${id}`, "PATCH", { action, note });
    setBusy(false);
    if (!r.ok) return setError(r.error || "Failed");
    router.refresh();
  }

  return (
    <div className="flex min-w-[220px] flex-col gap-2">
      <input
        className="input !py-2 text-xs"
        placeholder="Note to user (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex gap-2">
        <button disabled={busy} onClick={() => act("approve")} className="btn-gold !px-4 !py-1.5 text-xs">
          Approve
        </button>
        <button disabled={busy} onClick={() => act("reject")} className="btn-ghost !px-4 !py-1.5 text-xs">
          Reject
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function SettleForm({ id, amount }) {
  const router = useRouter();
  const [payout, setPayout] = useState(String(amount));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!confirm(`Settle with a payout of $${payout}? This credits the investor's balance.`)) return;
    setBusy(true);
    setError("");
    const r = await call(`/api/admin/investments/${id}/settle`, "POST", { payoutAmount: Number(payout) });
    setBusy(false);
    if (!r.ok) return setError(r.error || "Failed");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex min-w-[200px] items-center gap-2">
      <input
        type="number"
        step="any"
        min="0"
        required
        className="input !w-28 !py-2 text-xs"
        value={payout}
        onChange={(e) => setPayout(e.target.value)}
      />
      <button disabled={busy} className="btn-gold !px-4 !py-1.5 text-xs">
        Settle
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </form>
  );
}

export function UserToggle({ id, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const next = status === "active" ? "suspended" : "active";

  async function toggle() {
    setBusy(true);
    const r = await call(`/api/admin/users/${id}`, "PATCH", { status: next });
    setBusy(false);
    if (!r.ok) return alert(r.error || "Failed");
    router.refresh();
  }

  return (
    <button disabled={busy} onClick={toggle} className="btn-ghost !px-3 !py-1.5 text-xs">
      {status === "active" ? "Suspend" : "Reactivate"}
    </button>
  );
}

export function PlanToggle({ id, active }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const r = await call(`/api/admin/plans/${id}`, "PATCH", { active: !active });
    setBusy(false);
    if (!r.ok) return alert(r.error || "Failed");
    router.refresh();
  }

  return (
    <button disabled={busy} onClick={toggle} className="btn-ghost !px-3 !py-1.5 text-xs">
      {active ? "Deactivate" : "Activate"}
    </button>
  );
}

export function PlanForm() {
  const router = useRouter();
  const empty = {
    name: "",
    description: "",
    minAmount: "",
    maxAmount: "",
    unlimitedMax: false,
    targetReturnPercent: "",
    durationDays: "",
    riskLevel: "Medium",
  };
  const [v, setV] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) =>
    setV((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await call("/api/admin/plans", "POST", v);
    setBusy(false);
    if (!r.ok) return setError(r.error || "Failed");
    setV(empty);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Plan name</label>
        <input className="input" required value={v.name} onChange={set("name")} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Description</label>
        <textarea
                className="input min-h-[110px]"
                maxLength={1000}
                placeholder="Describe what this plan is about, who it suits and how it works."
                value={v.description}
                onChange={set("description")}
              />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Minimum (USD)</label>
        <input type="number" step="any" className="input" required value={v.minAmount} onChange={set("minAmount")} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Maximum (USD)</label>
        <input
          type="number"
          step="any"
          className="input disabled:opacity-40"
          required={!v.unlimitedMax}
          disabled={v.unlimitedMax}
          placeholder={v.unlimitedMax ? "Unlimited" : ""}
          value={v.unlimitedMax ? "" : v.maxAmount}
          onChange={set("maxAmount")}
        />
        <label className="mt-2 flex items-center gap-2 text-xs text-[var(--color-mist)]">
          <input type="checkbox" checked={v.unlimitedMax} onChange={set("unlimitedMax")} />
          Unlimited (no maximum)
        </label>
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Target return (%)</label>
        <input
          type="number"
          step="any"
          className="input"
          required
          value={v.targetReturnPercent}
          onChange={set("targetReturnPercent")}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Duration (days)</label>
        <input type="number" className="input" required value={v.durationDays} onChange={set("durationDays")} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Risk level</label>
        <select className="input" value={v.riskLevel} onChange={set("riskLevel")}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
      <button disabled={busy} className="btn-gold sm:col-span-2">
        {busy ? "Saving..." : "Create plan"}
      </button>
    </form>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none text-[var(--color-mist)] hover:text-white">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function BalanceButton({ id, name, balance }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    const verb = type === "add" ? "Add" : "Deduct";
    if (!confirm(`${verb} $${amount} ${type === "add" ? "to" : "from"} ${name}'s balance?`)) return;
    setBusy(true);
    setError("");
    const r = await call(`/api/admin/users/${id}/balance`, "POST", { type, amount: Number(amount), note });
    setBusy(false);
    if (!r.ok) return setError(r.error || "Failed");
    setOpen(false);
    setAmount("");
    setNote("");
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-ghost !px-3 !py-1.5 text-xs">
        Balance
      </button>
      {open && (
        <Modal title={`Adjust balance: ${name}`} onClose={() => setOpen(false)}>
          <p className="mb-4 text-sm text-[var(--color-mist)]">
            Current balance: <span className="text-white">${Number(balance).toLocaleString()}</span>
          </p>
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("add")}
                className={type === "add" ? "btn-gold !py-2 text-sm" : "btn-ghost !py-2 text-sm"}
              >
                Add funds
              </button>
              <button
                type="button"
                onClick={() => setType("deduct")}
                className={type === "deduct" ? "btn-gold !py-2 text-sm" : "btn-ghost !py-2 text-sm"}
              >
                Deduct funds
              </button>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Amount (USD)</label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">
                Reason (saved in the record and emailed to the user)
              </label>
              <input
                className="input"
                required
                minLength={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button disabled={busy} className="btn-gold">
              {busy ? "Saving..." : type === "add" ? "Add to balance" : "Deduct from balance"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

export function PlanActions({ plan }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({
    name: plan.name,
    description: plan.description || "",
    minAmount: String(plan.minAmount),
    maxAmount: plan.maxAmount == null ? "" : String(plan.maxAmount),
    unlimitedMax: plan.maxAmount == null,
    targetReturnPercent: String(plan.targetReturnPercent),
    durationDays: String(plan.durationDays),
    riskLevel: plan.riskLevel,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) =>
    setV((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await call(`/api/admin/plans/${plan.id}`, "PATCH", v);
    setBusy(false);
    if (!r.ok) return setError(r.error || "Failed");
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => setOpen(true)} className="btn-ghost !px-3 !py-1.5 text-xs">
        Edit
      </button>
      <PlanToggle id={plan.id} active={plan.active} />
      {open && (
        <Modal title="Edit plan" onClose={() => setOpen(false)}>
          <p className="mb-4 text-xs text-[var(--color-mist)]">
            Changes apply to new investments. Investments already made keep the terms they started with.
          </p>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Plan name</label>
              <input className="input" required value={v.name} onChange={set("name")} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Description</label>
              <textarea
                className="input min-h-[110px]"
                maxLength={1000}
                placeholder="Describe what this plan is about, who it suits and how it works."
                value={v.description}
                onChange={set("description")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Minimum (USD)</label>
              <input type="number" step="any" className="input" required value={v.minAmount} onChange={set("minAmount")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Maximum (USD)</label>
              <input
                type="number"
                step="any"
                className="input disabled:opacity-40"
                required={!v.unlimitedMax}
                disabled={v.unlimitedMax}
                placeholder={v.unlimitedMax ? "Unlimited" : ""}
                value={v.unlimitedMax ? "" : v.maxAmount}
                onChange={set("maxAmount")}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-[var(--color-mist)]">
                <input type="checkbox" checked={v.unlimitedMax} onChange={set("unlimitedMax")} />
                Unlimited (no maximum)
              </label>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Target return (%)</label>
              <input
                type="number"
                step="any"
                className="input"
                required
                value={v.targetReturnPercent}
                onChange={set("targetReturnPercent")}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Duration (days)</label>
              <input type="number" className="input" required value={v.durationDays} onChange={set("durationDays")} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Risk level</label>
              <select className="input" value={v.riskLevel} onChange={set("riskLevel")}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
            <button disabled={busy} className="btn-gold sm:col-span-2">
              {busy ? "Saving..." : "Save changes"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}