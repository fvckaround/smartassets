"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const links = [
  { href: "#plans", label: "Plans" },
  { href: "#markets", label: "Markets" },
  { href: "#how", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-mist lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link href="/login" className="btn-ghost text-sm">
            Sign in
          </Link>
          <Link href="/register" className="btn-gold text-sm">
            Get started
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="btn-ghost !px-3 !py-2 text-sm lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-mist hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <LanguageSwitcher className="mt-4" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/login" className="btn-ghost text-center text-sm">
              Sign in
            </Link>
            <Link href="/register" className="btn-gold text-center text-sm">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}