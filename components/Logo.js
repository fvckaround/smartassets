import Link from "next/link";

export default function Logo({ href = "/" }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#6ee7b7] to-[#0e9f6e] text-lg font-bold text-[#04120c]">
        S
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-semibold text-white">Smart Assets</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)]">
          Global Trade
        </span>
      </span>
    </Link>
  );
}