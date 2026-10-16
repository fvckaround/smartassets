"use client";

import { useEffect } from "react";

// Loads Google Translate once for the whole site (hidden). The visible control is LanguageSwitcher.
export default function TranslateLoader() {
  useEffect(() => {
    // Google Translate rewrites text nodes, which can make React throw "removeChild" errors.
    // These guards make those calls harmless.
    if (typeof Node === "function" && !window.__gtPatched) {
      window.__gtPatched = true;
      const origRemove = Node.prototype.removeChild;
      Node.prototype.removeChild = function (child) {
        if (child.parentNode !== this) return child;
        return origRemove.apply(this, arguments);
      };
      const origInsert = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function (newNode, ref) {
        if (ref && ref.parentNode !== this) return newNode;
        return origInsert.apply(this, arguments);
      };
    }

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      } catch {
        /* widget unavailable */
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <style>{`
        body > .skiptranslate, iframe.skiptranslate, .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .goog-tooltip, .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
      `}</style>
    </>
  );
}