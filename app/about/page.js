import Link from "next/link";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { whatsappLink } from "@/lib/contact";

export const metadata = {
  title: "About us",
  description:
    "Learn who Smart Assets Global Trade is, how our investment plans work and how we protect your account and funds.",
};

const values = [
  {
    title: "Clear terms",
    text: "Every plan shows its minimum and maximum amount, its duration and its target return before you commit a single dollar.",
  },
  {
    title: "Honest about risk",
    text: "Returns are targets, not promises. We say so on every plan, and our risk disclosure explains what can go wrong.",
  },
  {
    title: "Real people behind it",
    text: "Deposits and withdrawals are reviewed by our team, and you can reach us by email or WhatsApp whenever you need help.",
  },
];

const steps = [
  { n: "01", title: "Create your account", text: "Sign up in a few minutes with your name, email and a secure password." },
  { n: "02", title: "Fund your balance", text: "Send a deposit to one of our listed wallets. Our team checks it and credits your balance once confirmed." },
  { n: "03", title: "Choose a plan", text: "Pick a plan that suits your amount and timeline. You can follow its progress on your dashboard." },
  { n: "04", title: "Receive your payout", text: "When the term ends, the payout is added to your balance automatically, and you can request a withdrawal." },
];

const security = [
  {
    title: "Your password stays private",
    text: "Passwords are stored as one-way bcrypt hashes. Nobody, including our own team, can see or recover your password.",
  },
  {
    title: "Encrypted connection",
    text: "The whole site runs over HTTPS, so the information you send and receive is encrypted in transit.",
  },
  {
    title: "Every deposit is checked",
    text: "A deposit is only added to your balance after our team has confirmed it. Nothing is credited on a guess.",
  },
  {
    title: "Withdrawals are protected",
    text: "When you request a withdrawal, the amount is set aside straight away so it cannot be spent twice. If a request is rejected, the full amount returns to your balance.",
  },
  {
    title: "All-or-nothing balance updates",
    text: "Balance changes run as database transactions. Either every step completes, or none of it does, so your balance can never end up half-updated.",
  },
  {
    title: "Paid once, and only once",
    text: "Each investment can only be settled a single time, so a payout can never be duplicated or lost in a retry.",
  },
  {
    title: "Email alerts on your account",
    text: "You get an email when a deposit or withdrawal is received, approved or rejected, and when you start a plan, so nothing happens without you knowing.",
  },
  {
    title: "Restricted admin access",
    text: "Only administrator accounts can review transactions, and that access is checked on every single request.",
  },
  {
    title: "Your data is yours",
    text: "You can only see and act on your own balance, investments and history. No other user can view your account.",
  },
];

const never = [
  "Ask for your password, by email, phone, WhatsApp or anywhere else.",
  "Ask for your wallet private keys or recovery phrase.",
  "Ask you to send money to a wallet that is not shown in your dashboard.",
  "Pressure you to invest quickly or promise guaranteed profit.",
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Intro */}
        <section className="border-b border-line py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">About us</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
              Investing in digital assets, made simple and transparent
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist">
              Smart Assets Global Trade is an investment company that gives people a straightforward way to take part
              in the digital-asset market. We offer fixed-term investment plans with published terms, a clear
              dashboard to follow your money, and a support team you can actually reach.
            </p>
          </div>
        </section>

        {/* Mission + values */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold">Our mission</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Opportunity without the confusion</h2>
                <p className="mt-4 text-sm leading-relaxed text-mist">
                  Crypto can feel complicated and risky for newcomers. Our goal is to remove the confusion: you choose a
                  plan, you see exactly what it targets and how long it runs, and you can follow every step from your
                  dashboard. When the term ends, your payout is credited to your balance automatically.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-mist">
                  We believe trust is earned through openness. That is why we publish our terms, explain our risks and
                  tell you exactly how your account is protected below.
                </p>
              </div>
              <div className="grid gap-4">
                {values.map((v) => (
                  <div key={v.title} className="card p-5">
                    <h3 className="text-lg font-medium text-white">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-line bg-navy/60 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">How it works</p>
            <h2 className="mt-3 text-center text-3xl font-semibold text-white">From sign-up to payout</h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="card h-full p-6">
                  <p className="gold-text text-2xl font-semibold">{s.n}</p>
                  <h3 className="mt-3 text-lg font-medium text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">Security</p>
            <h2 className="mt-3 text-center text-3xl font-semibold text-white md:text-4xl">
              How we keep your money and account safe
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-mist">
              Security is built into every part of the platform, from the moment you sign in to the moment you
              withdraw. Here is exactly what protects you.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {security.map((p) => (
                <div key={p.title} className="card h-full p-6">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{p.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="card p-6">
                <h3 className="text-lg font-medium text-white">We will never</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mist">
                  {never.map((n) => (
                    <li key={n} className="flex gap-2">
                      <span className="text-red-400">✕</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-mist">
                  If anyone contacts you claiming to be from Smart Assets and asks for any of these, do not respond and
                  let us know straight away.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-medium text-white">How you can help</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mist">
                  <li className="flex gap-2"><span className="text-[var(--color-gold)]">✓</span><span>Use a strong password you do not use on any other site.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--color-gold)]">✓</span><span>Always copy wallet addresses from your dashboard and double-check before sending.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--color-gold)]">✓</span><span>Read every email we send about your account, and contact us if something looks wrong.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--color-gold)]">✓</span><span>Only invest money you can afford to set aside for the full plan term.</span></li>
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-mist">
              These safeguards protect your account and your balance on our platform. They do not remove market risk:
              digital-asset prices can fall, target returns are not guaranteed, and you can lose some or all of your
              capital. Please read our{" "}
              <Link href="/risk-disclosure" className="text-white underline">
                risk disclosure
              </Link>{" "}
              before investing.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="card bg-grid p-10 text-center">
              <h2 className="text-3xl font-semibold text-white">Questions before you start?</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-mist">
                Our team is happy to explain how the plans work or how your account is protected.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/register" className="btn-gold w-full px-8 sm:w-auto">Create an account</Link>
                <Link href="/contact" className="btn-ghost w-full px-8 sm:w-auto">Contact us</Link>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg bg-[#25D366] px-8 py-3 text-center text-sm font-semibold text-white hover:brightness-110 sm:w-auto"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}