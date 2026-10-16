"use client";

import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/languages";

function currentLanguage() {
  try {
    const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "en";
  } catch {
    return "en";
  }
}

function clearTranslateCookies() {
  const past = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  document.cookie = `googtrans=; ${past}; path=/`;
  document.cookie = `googtrans=; ${past}; path=/; domain=${host}`;
  document.cookie = `googtrans=; ${past}; path=/; domain=.${host}`;
}

function setTranslateCookie(code) {
  const value = `/en/${code}`;
  const host = window.location.hostname;
  document.cookie = `googtrans=${value}; path=/`;
  document.cookie = `googtrans=${value}; path=/; domain=${host}`;
}

export default function LanguageSwitcher({ className = "" }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(currentLanguage());
  }, []);

  function onChange(e) {
    const code = e.target.value;
    setLang(code);

    if (code === "en") {
      clearTranslateCookies();
      window.location.reload();
      return;
    }

    // Preferred: drive Google's hidden dropdown so the page translates without reloading.
    const combo = document.querySelector("select.goog-te-combo");
    if (combo) {
      combo.value = code;
      if (combo.value === code) {
        combo.dispatchEvent(new Event("change"));
        return;
      }
    }
    // Fallback: set the cookie and reload; the widget translates on load.
    setTranslateCookie(code);
    window.location.reload();
  }

  return (
    <label className={`notranslate inline-flex items-center gap-1.5 ${className}`} translate="no">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-mist"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
      </svg>
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={onChange}
        translate="no"
        className="notranslate max-w-[10rem] cursor-pointer rounded-lg border border-line bg-panel px-2 py-1.5 text-xs text-white outline-none focus:border-gold"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-panel text-white">
            {l.name}
          </option>
        ))}
      </select>
    </label>
  );
}