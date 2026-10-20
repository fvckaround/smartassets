"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function send(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: data.error };
}

const label = "mb-1.5 block text-sm text-mist";

export function ProfileForm({ initial }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    const r = await send("/api/account/profile", "PATCH", v);
    setBusy(false);
    if (!r.ok) return setMsg({ type: "error", text: r.error || "Could not save your changes." });
    setMsg({ type: "ok", text: "Your profile has been updated." });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="text-lg font-medium text-white">Profile</h2>
      <div>
        <label className={label}>Full name</label>
        <input className="input" required maxLength={80} value={v.name} onChange={set("name")} autoComplete="name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Phone (optional)</label>
          <input className="input" maxLength={30} value={v.phone} onChange={set("phone")} autoComplete="tel" placeholder="+1 555 000 0000" />
        </div>
        <div>
          <label className={label}>Country (optional)</label>
          <input className="input" maxLength={60} value={v.country} onChange={set("country")} autoComplete="country-name" />
        </div>
      </div>
      {msg.text && <p className={`text-sm ${msg.type === "ok" ? "text-emerald-300" : "text-red-400"}`}>{msg.text}</p>}
      <button className="btn-gold" disabled={busy}>
        {busy ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [v, setV] = useState(empty);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const type = show ? "text" : "password";

  async function submit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (v.newPassword !== v.confirmPassword) return setMsg({ type: "error", text: "New passwords do not match." });
    setBusy(true);
    const r = await send("/api/account/password", "POST", v);
    setBusy(false);
    if (!r.ok) return setMsg({ type: "error", text: r.error || "Could not change your password." });
    setV(empty);
    setMsg({ type: "ok", text: "Password changed. Use your new password next time you sign in." });
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="text-lg font-medium text-white">Change password</h2>
      <div>
        <label className={label}>Current password</label>
        <input type={type} className="input" required value={v.currentPassword} onChange={set("currentPassword")} autoComplete="current-password" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>New password</label>
          <input type={type} className="input" required minLength={8} value={v.newPassword} onChange={set("newPassword")} autoComplete="new-password" />
        </div>
        <div>
          <label className={label}>Confirm new password</label>
          <input type={type} className="input" required minLength={8} value={v.confirmPassword} onChange={set("confirmPassword")} autoComplete="new-password" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-mist">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
        Show passwords
      </label>
      <p className="text-xs text-mist">At least 8 characters. Use a password you do not use on any other site.</p>
      {msg.text && <p className={`text-sm ${msg.type === "ok" ? "text-emerald-300" : "text-red-400"}`}>{msg.text}</p>}
      <button className="btn-gold" disabled={busy}>
        {busy ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}