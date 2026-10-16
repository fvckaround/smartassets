import Link from "next/link";
import Reveal from "./Reveal";

const steps = [
  { n: "01", t: "Create an account", d: "Register with your email and read and accept the risk disclosure." },
  { n: "02", t: "Fund your balance", d: "Send crypto to our deposit address and submit the transaction hash for review." },
  { n: "03", t: "Choose a plan", d: "Pick a plan that fits your amount, timeline and risk tolerance." },
  { n: "04", t: "Track and withdraw", d: "Follow your investments in the dashboard and request withdrawals when you need them." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="band-light py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#0e9f6e]">
            Getting started
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-[#0b2a1d] md:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#456b5a]">
            Four steps from sign-up to your first investment.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="h-full">
              <div className="card h-full p-6">
                <div className="text-3xl font-semibold text-[#14b574]">{s.n}</div>
                <h3 className="mt-3 text-lg font-medium text-[#0b2a1d]">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#456b5a]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/register" className="btn-gold inline-block px-8">
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}