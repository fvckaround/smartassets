"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/contact";

const EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "smartassetsglobal@gmail.com";

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send your message.");
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (err) {
      setError(err.message || "Could not send your message.");
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <Logo />
        <LanguageSwitcher />
      </div>

      <h1 className="mt-10 font-display text-3xl text-white">Contact us</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-mist)]">
        Have a question about your account, a deposit, a withdrawal or one of our plans? Send us a message and our
        team will reply by email.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          <div className="card p-6">
            <p className="text-xs uppercase tracking-widest text-[var(--color-mist)]">Email</p>
            <a href={`mailto:${EMAIL}`} className="mt-2 block break-all text-lg text-white hover:underline">
              {EMAIL}
            </a>
            <p className="mt-2 text-sm text-[var(--color-mist)]">
              We reply to every message, usually within one business day.
            </p>
          </div>
          <div className="card p-6">
            <p className="text-xs uppercase tracking-widest text-[var(--color-mist)]">WhatsApp</p>
            <p className="notranslate mt-2 text-lg text-white">{WHATSAPP_DISPLAY}</p>
            <p className="mt-2 text-sm text-[var(--color-mist)]">Chat with our support team directly.</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="card p-6 text-sm leading-relaxed text-[var(--color-mist)]">
            <p className="font-medium text-white">Before you write</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Include the email you registered with.</li>
              <li>For a deposit or withdrawal, include the amount and transaction reference.</li>
              <li>We will never ask for your password or private keys.</li>
            </ul>
          </div>
        </div>

        <div className="card p-6 md:col-span-3">
          {status === "sent" ? (
            <div className="py-6 text-center">
              <p className="text-lg font-medium text-white">Message sent</p>
              <p className="mt-2 text-sm text-[var(--color-mist)]">
                Thank you. We have received your message and sent a confirmation to your email. We will reply soon.
              </p>
              <button type="button" className="btn-ghost mt-6" onClick={() => setStatus("idle")}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Full name</label>
                  <input className="input" required maxLength={100} value={form.name} onChange={set("name")} autoComplete="name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Email</label>
                  <input type="email" className="input" required maxLength={200} value={form.email} onChange={set("email")} autoComplete="email" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Subject</label>
                <input className="input" required maxLength={150} value={form.subject} onChange={set("subject")} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--color-mist)]">Message</label>
                <textarea className="input min-h-[150px]" required minLength={10} maxLength={3000} value={form.message} onChange={set("message")} />
              </div>

              {/* Hidden spam trap: real people never see or fill this */}
              <div className="hidden" aria-hidden="true">
                <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
              </div>

              {status === "error" && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" className="btn-gold w-full" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>

      <Link href="/" className="btn-ghost mt-10 inline-block">Back to home</Link>
    </main>
  );
}