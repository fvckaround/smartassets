import Link from "next/link";

// Smart Assets mark: a blockchain "block" (hexagon with chain nodes) holding a rising chart —
// crypto + investment growth.
export function LogoMark({ size = 40, className = "" }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sa-hex-outer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8ff5cb" />
          <stop offset="1" stopColor="#0b8f62" />
        </linearGradient>
        <linearGradient id="sa-hex-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d2a1f" />
          <stop offset="1" stopColor="#04120c" />
        </linearGradient>
      </defs>
      <path d="M32 2 L58 17 L58 47 L32 62 L6 47 L6 17 Z" fill="url(#sa-hex-outer)" />
      <path d="M32 7.5 L53.3 19.8 L53.3 44.2 L32 56.5 L10.7 44.2 L10.7 19.8 Z" fill="url(#sa-hex-inner)" />
      <rect x="18" y="37" width="6" height="9" rx="1.5" fill="#1fd18a" opacity="0.55" />
      <rect x="27" y="31" width="6" height="15" rx="1.5" fill="#1fd18a" opacity="0.75" />
      <rect x="36" y="25" width="6" height="21" rx="1.5" fill="#1fd18a" />
      <path d="M16 33 L25 25 L31 29 L44 17" fill="none" stroke="#e8fff4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38.5 15.5 L46 15 L45.5 22.5 Z" fill="#e8fff4" stroke="#e8fff4" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="32" cy="2.8" r="2.6" fill="#e8fff4" />
      <circle cx="58" cy="17" r="2.6" fill="#e8fff4" />
      <circle cx="6" cy="47" r="2.6" fill="#e8fff4" />
    </svg>
  );
}

export default function Logo({ href = "/" }) {
  return (
    <Link href={href} className="notranslate flex items-center gap-2.5" translate="no" aria-label="Smart Assets home">
      <LogoMark size={40} className="shrink-0" />
      <span className="leading-tight">
        <span className="block text-lg font-bold tracking-tight text-white">
          Smart <span className="text-[var(--color-gold)]">Assets</span>
        </span>
        <span className="block text-[10px] uppercase tracking-[0.22em] text-mist">Global Trade</span>
      </span>
    </Link>
  );
}
