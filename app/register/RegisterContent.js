"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FOUND_US_OPTIONS } from "@/lib/survey";

export default function RegisterContent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    ref: "",
    foundUs: "",
    rating: 0,
    acceptedRisk: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill the referral code from a link like /register?ref=ABC12345
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref) setForm((f) => ({ ...f, ref: ref.trim().toUpperCase() }));
    } catch {
      /* ignore */
    }
  }, []);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account.");
        setLoading(false);
        return;
      }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="bg-grid grid min-h-screen place-items-center px-4 py-10">
      <div className="fixed right-4 top-4 z-50">
        <LanguageSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-lg p-8"
      >
        <Logo />
        <h1 className="mt-8 font-display text-2xl text-white">Create your account</h1>
        <p className="mt-1 text-sm text-[var(--color-mist)]">It takes less than a minute.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Full name</label>
            <input className="input" required value={form.name} onChange={set("name")} autoComplete="name" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Email</label>
            <input type="email" className="input" required value={form.email} onChange={set("email")} autoComplete="email" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Phone</label>
            <input className="input" value={form.phone} onChange={set("phone")} autoComplete="tel" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Country</label>
            <input className="input" value={form.country} onChange={set("country")} autoComplete="country-name" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Password (min 8 characters)</label>
            <input
              type="password"
              className="input"
              required
              minLength={8}
              value={form.password}
              onChange={set("password")}
              autoComplete="new-password"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Referral code (optional)</label>
            <input
              className="input uppercase"
              value={form.ref}
              onChange={set("ref")}
              autoComplete="off"
              maxLength={20}
              placeholder="e.g. K7M2QX9A"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">How did you find us? (optional)</label>
            <select className="input" value={form.foundUs} onChange={set("foundUs")}>
              <option value="">Prefer not to say</option>
              {FOUND_US_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">
              What rating would you give us? (optional)
            </label>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating out of 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={form.rating === n}
                  aria-label={`${n} out of 5`}
                  onClick={() => setForm((f) => ({ ...f, rating: f.rating === n ? 0 : n }))}
                  className={`text-3xl leading-none transition ${
                    n <= form.rating ? "text-[var(--color-gold)]" : "text-[var(--color-line)] hover:text-[var(--color-mist)]"
                  }`}
                >
                  ★
                </button>
              ))}
              {form.rating > 0 && <span className="ml-2 text-xs text-[var(--color-mist)]">{form.rating}/5</span>}
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--color-mist)] sm:col-span-2">
            <input
              type="checkbox"
              checked={form.acceptedRisk}
              onChange={set("acceptedRisk")}
              className="mt-1 h-4 w-4 accent-[#d4af37]"
            />
            <span>
              I understand that investing in digital assets is risky, that I could lose all of my capital, and that
              target returns are not guaranteed. I have read the{" "}
              <Link href="/risk-disclosure" className="text-[var(--color-gold)] underline" target="_blank">
                risk disclosure
              </Link>
              .
            </span>
          </label>

          {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}

          <button type="submit" disabled={loading} className="btn-gold sm:col-span-2">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-mist)]">
          Already registered?{" "}
          <Link href="/login" className="text-[var(--color-gold)] hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}