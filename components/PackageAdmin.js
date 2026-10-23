"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function call(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: data.error };
}

const label = "mb-1.5 block text-sm text-[var(--color-mist)]";
const empty = { kind: "package", name: "", benefits: "", price: "", maxLabel: "Unlimited", order: "0", published: true };

function Fields({ v, set }) {
  const reward = v.kind === "reward";
  return (
    <>
      <div className="sm:col-span-2">
        <label className={label}>Type</label>
        <select className="input" value={v.kind} onChange={set("kind")}>
          <option value="package">Ambassador package</option>
          <option value="reward">Reward</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={label}>{reward ? "Reward title" : "Package name"}</label>
        <input className="input" required maxLength={80} value={v.name} onChange={set("name")} placeholder={reward ? "e.g. 20 Downlines" : "e.g. Ambassador Package"} />
      </div>
      <div className="sm:col-span-2">
        <label className={label}>{reward ? "Reward details (one per line)" : "Benefits (one per line)"}</label>
        <textarea
          className="input min-h-[170px]"
          required
          maxLength={3000}
          value={v.benefits}
          onChange={set("benefits")}
          placeholder={"Write each benefit on its own line.\nEach line shows as a numbered point on the website."}
        />
      </div>
      {!reward && (
        <>
          <div>
            <label className={label}>Price (USD)</label>
            <input type="number" step="any" min="0" className="input" required value={v.price} onChange={set("price")} />
          </div>
          <div>
            <label className={label}>Maximum (text)</label>
            <input className="input" maxLength={40} value={v.maxLabel} onChange={set("maxLabel")} placeholder="Unlimited" />
          </div>
        </>
      )}
    </>
  );
}

export function PackageForm() {
  const router = useRouter();
  const [v, setV] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await call("/api/admin/packages", "POST", v);
    setBusy(false);
    if (!r.ok) return setError(r.error || "Could not save the package.");
    setV(empty);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2">
      <Fields v={v} set={set} />
      <label className="flex items-center gap-2 self-end text-sm text-[var(--color-mist)]">
        <input type="checkbox" checked={v.published} onChange={set("published")} />
        Show on the website now
      </label>
      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
      <button disabled={busy} className="btn-gold sm:col-span-2">
        {busy ? "Saving..." : v.kind === "reward" ? "Create reward" : "Create package"}
      </button>
    </form>
  );
}

export function PackageActions({ pkg }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ ...pkg, price: String(pkg.price), order: String(pkg.order) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const r = await call(`/api/admin/packages/${pkg.id}`, "PATCH", v);
    setBusy(false);
    if (!r.ok) return setError(r.error || "Could not save.");
    setOpen(false);
    router.refresh();
  }

  async function toggle() {
    setBusy(true);
    const r = await call(`/api/admin/packages/${pkg.id}`, "PATCH", { published: !pkg.published });
    setBusy(false);
    if (!r.ok) return alert(r.error || "Failed");
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this item?")) return;
    setBusy(true);
    const r = await call(`/api/admin/packages/${pkg.id}`, "DELETE");
    setBusy(false);
    if (!r.ok) return alert(r.error || "Failed");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => setOpen(true)} className="btn-ghost !px-3 !py-1.5 text-xs">Edit</button>
      <button disabled={busy} onClick={toggle} className="btn-ghost !px-3 !py-1.5 text-xs">
        {pkg.published ? "Hide" : "Publish"}
      </button>
      <button disabled={busy} onClick={remove} className="btn-ghost !px-3 !py-1.5 text-xs text-red-300">Delete</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setOpen(false)}>
          <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" style={{ backgroundColor: "#071a12" }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl text-white">{v.kind === "reward" ? "Edit reward" : "Edit package"}</h3>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none text-[var(--color-mist)] hover:text-white">&times;</button>
            </div>
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              <Fields v={v} set={set} />
              {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
              <button disabled={busy} className="btn-gold sm:col-span-2">{busy ? "Saving..." : "Save changes"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
