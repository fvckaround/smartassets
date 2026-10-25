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

// The language picker now floats at the bottom-left of every page (rendered once in app/layout.js
// with the "floating" prop). Older in-page usages (<LanguageSwitcher /> in the menu, login, register,
// dashboard...) render nothing, so there is never a duplicate picker.
export default function LanguageSwitcher({ floating = false }) {
  if (!floating) return null;
  return <FloatingPicker />;
}

function FloatingPicker() {
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
    <label
      className="notranslate fixed bottom-24 left-5 z-50 inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/95 py-1.5 pl-3 pr-1.5 shadow-lg shadow-black/40 backdrop-blur"
      translate="no"
      title="Change language"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-gold"
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
        className="notranslate max-w-[8.5rem] cursor-pointer rounded-full border-0 bg-transparent py-1.5 pl-1 pr-2 text-sm text-white outline-none sm:max-w-[11rem]"
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
