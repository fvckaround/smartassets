"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function api(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: data.error };
}

const empty = { name: "", symbol: "", network: "", address: "" };

function WalletForm({ id, initial, onDone }) {
  const router = useRouter();
  const [v, setV] = useState(initial || empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = id
      ? await api(`/api/admin/wallets/${id}`, "PATCH", v)
      : await api("/api/admin/wallets", "POST", v);
    setBusy(false);
    if (!r.ok) return setError(r.error || "Failed");
    if (!id) setV(empty);
    router.refresh();
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
      <div>
        <label className="mb-1.5 block text-sm text-mist">Coin name</label>
        <input className="input" required placeholder="Bitcoin" value={v.name} onChange={set("name")} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-mist">Symbol</label>
        <input className="input" required placeholder="BTC" value={v.symbol} onChange={set("symbol")} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-mist">Network (optional)</label>
        <input className="input" placeholder="TRC20" value={v.network} onChange={set("network")} />
      </div>
      <div className="sm:col-span-3">
        <label className="mb-1.5 block text-sm text-mist">Deposit wallet address</label>
        <input className="input" required value={v.address} onChange={set("address")} />
      </div>
      {error && <p className="text-sm text-red-400 sm:col-span-3">{error}</p>}
      <div className="flex gap-3 sm:col-span-3">
        <button disabled={busy} className="btn-gold text-sm">
          {busy ? "Saving..." : id ? "Save changes" : "Add wallet"}
        </button>
        {id && (
          <button type="button" onClick={onDone} className="btn-ghost text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function WalletManager({ wallets }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function toggle(w) {
    setBusyId(w.id);
    const r = await api(`/api/admin/wallets/${w.id}`, "PATCH", { active: !w.active });
    setBusyId(null);
    if (!r.ok) return alert(r.error || "Failed");
    router.refresh();
  }

  async function remove(w) {
    if (!confirm(`Delete ${w.name}${w.network ? ` (${w.network})` : ""}? Users will no longer see it.`)) return;
    setBusyId(w.id);
    const r = await api(`/api/admin/wallets/${w.id}`, "DELETE");
    setBusyId(null);
    if (!r.ok) return alert(r.error || "Failed");
    router.refresh();
  }

  return (
    <div>
      <div className="card mt-8 overflow-x-auto">
        {wallets.length === 0 ? (
          <p className="p-6 text-sm text-mist">
            No wallets yet. Add your first deposit wallet below. Users cannot deposit until at least one active
            wallet exists.
          </p>
        ) : (
          <table className="stack w-full text-left text-sm xl:min-w-[760px]">
            <thead className="text-mist">
              <tr className="border-b border-line">
                <th className="p-4 font-normal">Coin</th>
                <th className="p-4 font-normal">Network</th>
                <th className="p-4 font-normal">Address</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal" />
              </tr>
            </thead>
            <tbody>
              {wallets.map((w) =>
                editingId === w.id ? (
                  <tr key={w.id} className="border-b border-line/60 last:border-0">
                    <td colSpan={5} className="full p-4">
                      <WalletForm
                        id={w.id}
                        initial={{ name: w.name, symbol: w.symbol, network: w.network, address: w.address }}
                        onDone={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={w.id} className="border-b border-line/60 align-top last:border-0">
                    <td data-label="Coin" className="p-4">
                      <div className="text-white">{w.name}</div>
                      <div className="text-xs text-mist">{w.symbol}</div>
                    </td>
                    <td data-label="Network" className="p-4">
                      {w.network || "-"}
                    </td>
                    <td data-label="Address" className="full max-w-[280px] break-all p-4 text-xs">
                      {w.address}
                    </td>
                    <td data-label="Status" className={`p-4 ${w.active ? "text-gold" : "text-mist"}`}>
                      {w.active ? "Active" : "Hidden"}
                    </td>
                    <td className="full p-4">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setEditingId(w.id)} className="btn-ghost !px-3 !py-1.5 text-xs">
                          Edit
                        </button>
                        <button
                          disabled={busyId === w.id}
                          onClick={() => toggle(w)}
                          className="btn-ghost !px-3 !py-1.5 text-xs"
                        >
                          {w.active ? "Hide" : "Show"}
                        </button>
                        <button
                          disabled={busyId === w.id}
                          onClick={() => remove(w)}
                          className="btn-ghost !px-3 !py-1.5 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="mt-10 text-xl font-semibold text-white">Add a deposit wallet</h2>
      <div className="card mt-4 p-6">
        <WalletForm />
      </div>
    </div>
  );
}