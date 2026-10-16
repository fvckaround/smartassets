"use client";

import { useState } from "react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button type="button" onClick={copy} className="btn-ghost shrink-0 px-3 py-1.5 text-xs">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}