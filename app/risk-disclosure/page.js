import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Risk disclosure",
  description: "Read the risks of investing in digital assets with Smart Assets Global Trade.",
};

export default function RiskDisclosurePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Logo />
      <h1 className="mt-10 font-display text-3xl text-white">Risk disclosure</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[var(--color-mist)]">
        <p>
          Investing in digital assets involves a high degree of risk. Prices can move sharply in either direction in
          short periods, and you may lose some or all of the capital you invest.
        </p>
        <p>
          Any return figure shown on this site is a <strong className="text-white">target</strong> over the stated
          duration. It is not a promise, a guarantee or a forecast of what you will receive. Past performance does not
          indicate future results.
        </p>
        <p>
          Only invest money you can afford to lose. Do not borrow to invest, and be cautious of anyone who promises
          guaranteed profits or pressures you to act quickly.
        </p>
        <p>
          Cryptocurrency transfers are generally irreversible. Check every wallet address carefully before sending
          funds. Deposits and withdrawals are reviewed manually and may take time to process.
        </p>
        <p>
          Smart Assets does not provide personal financial, legal or tax advice. If you are unsure whether an
          investment is suitable for you, speak to an independent, licensed adviser in your country, and confirm that
          this service may lawfully be offered to you where you live.
        </p>
      </div>
      <Link href="/" className="btn-ghost mt-10 inline-block">Back to home</Link>
    </main>
  );
}