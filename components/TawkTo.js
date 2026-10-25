"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Tawk.to live chat. Loaded once for the whole site; hidden inside the admin panel.
const TAWK_SRC = "https://embed.tawk.to/6addbb620f2c2c346f1ce553/1k5p27unm";

export default function TawkTo() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");

  // Load the script once.
  useEffect(() => {
    if (window.__tawkLoaded) return;
    window.__tawkLoaded = true;
    window.Tawk_API = window.Tawk_API || {};
    // Show the chat bubble in the bottom-LEFT corner (the language picker sits above it).
    window.Tawk_API.customStyle = {
      visibility: {
        desktop: { position: "bl", xOffset: 20, yOffset: 20 },
        mobile: { position: "bl", xOffset: 10, yOffset: 10 },
      },
    };
    window.Tawk_LoadStart = new Date();
    const s = document.createElement("script");
    s.async = true;
    s.src = TAWK_SRC;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }, []);

  // Hide the chat bubble in the admin panel, show it everywhere else.
  useEffect(() => {
    const api = window.Tawk_API || {};
    const apply = () => {
      try {
        if (isAdmin) api.hideWidget?.();
        else api.showWidget?.();
      } catch {}
    };
    if (typeof api.hideWidget === "function") apply();
    else {
      const prev = api.onLoad;
      api.onLoad = function () {
        if (typeof prev === "function") prev();
        apply();
      };
      window.Tawk_API = api;
    }
  }, [isAdmin]);

  return null;
}
