"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    // Middleware sends admins to /admin from /login redirect rules; default to dashboard.
    window.location.href = "/dashboard";
  }

  return (
    <main className="bg-grid grid min-h-screen place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-md p-8"
      >
        <Logo />
        <h1 className="mt-8 font-display text-2xl text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--color-mist)]">Sign in to manage your account.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-mist)]">
          New here?{" "}
          <Link href="/register" className="text-[var(--color-gold)] hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </main>
  );
}