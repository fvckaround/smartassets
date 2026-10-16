"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Shared form used by the deposit and withdraw pages.
// `methods` is a list of { value, label } (value is the wallet id).
export default function RequestForm({
  endpoint,
  fields,
  submitLabel,
  successMessage,
  methods,
  methodLabel = "Method",
}) {
  const router = useRouter();
  const [values, setValues] = useState(() => {
    const init = { method: methods?.[0]?.value || "" };
    fields.forEach((f) => (init[f.name] = ""));
    return init;
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setDone("");
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed.");
      } else {
        setDone(successMessage);
        setValues((v) => {
          const next = { ...v };
          fields.forEach((f) => (next[f.name] = ""));
          return next;
        });
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {methods && (
        <div>
          <label className="mb-1.5 block text-sm text-mist">{methodLabel}</label>
          <select className="input" value={values.method} onChange={set("method")}>
            {methods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {fields.map((f) => (
        <div key={f.name}>
          <label className="mb-1.5 block text-sm text-mist">{f.label}</label>
          <input
            className="input"
            type={f.type || "text"}
            step={f.type === "number" ? "any" : undefined}
            min={f.min}
            required
            placeholder={f.placeholder}
            value={values[f.name]}
            onChange={set(f.name)}
          />
        </div>
      ))}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {done && <p className="text-sm text-gold">{done}</p>}
      <button type="submit" disabled={loading} className="btn-gold w-full">
        {loading ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}