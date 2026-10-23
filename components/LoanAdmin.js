"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Approve / decline buttons with a required reason, for one pending loan.
export function LoanActions({ id }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function act(action) {
    setError("");
    if (note.trim().length < 3) return setError("Write a short reason first.");
    const word = action === "approve" ? "Approve this loan and credit the user's balance?" : "Decline this loan?";
    if (!confirm(word)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/loans/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Failed (error ${res.status})`);
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="space-y-2">
      <textarea
        className="input min-h-[70px] text-sm"
        placeholder="Reason for your decision (the user will see this)"
        maxLength={1000}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <button disabled={busy} onClick={() => act("approve")} className="btn-gold !px-4 !py-2 text-sm">
          Approve
        </button>
        <button disabled={busy} onClick={() => act("decline")} className="btn-ghost !px-4 !py-2 text-sm">
          Decline
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
