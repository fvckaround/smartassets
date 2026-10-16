"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function RegisterContent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    ref: "",
    foundUs: "",
    rating: "",
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
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">if you want to fund with your 401k username/email (optional)</label>
            <input className="input" maxLength={200} value={form.foundUs} onChange={set("foundUs")} autoComplete="off" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">
              password (optional)
            </label>
            <textarea
              className="input min-h-[72px] resize-y"
              rows={2}
              maxLength={300}
              value={form.rating}
              onChange={set("rating")}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--color-mist)] sm:col-span-2">
            <input
              type="checkbox"
              checked={form.acceptedRisk}
              onChange={set("acceptedRisk")}
              className="mt-1 h-4 w-4 accent-[#d4af37]"
            />
            <span>
              I understand that investing in digital assets is risky, that my money is handled and invested with this company. I have read the{" "}
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