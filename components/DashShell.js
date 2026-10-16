"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Logo from "@/components/Logo";

export default function DashShell({ user, links, children, badge }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = (active) =>
    `block whitespace-nowrap rounded-lg px-4 py-2.5 text-sm transition ${
      active ? "bg-gold/10 text-gold" : "text-mist hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-navy/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Logo href="/" />
            {badge && (
              <span className="shrink-0 rounded-full border border-gold/40 px-2.5 py-0.5 text-xs text-gold">
                {badge}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="btn-ghost shrink-0 !px-3 !py-2 text-sm"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <div className="max-h-[calc(100vh-70px)] overflow-y-auto border-t border-line px-4 pb-5 pt-3">
            <nav className="grid gap-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass(pathname === l.href)}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-line pt-4">
              <p className="truncate text-sm text-white">{user.name}</p>
              <p className="truncate text-xs text-mist">{user.email}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-ghost mt-3 w-full whitespace-nowrap text-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden border-r border-line bg-navy lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="px-5 py-5">
          <Logo href="/" />
          {badge && (
            <span className="mt-4 inline-block rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
              {badge}
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(pathname === l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-6">
          <p className="truncate text-sm text-white">{user.name}</p>
          <p className="truncate text-xs text-mist">{user.email}</p>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost mt-3 w-full text-sm">
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 lg:px-10 lg:py-8">{children}</main>
    </div>
  );
}