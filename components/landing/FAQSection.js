import Reveal from "./Reveal";

const faqs = [
  {
    q: "What is Smart Assets Global Trade?",
    a: "Smart Assets is an investment platform that offers digital-asset investment plans with published terms, a personal dashboard and reviewed deposits and withdrawals.",
  },
  {
    q: "Are returns guaranteed?",
    a: "No. Every return figure shown is a target over the plan duration, not a promise. Digital assets are volatile and you can lose some or all of the money you invest.",
  },
  {
    q: "How do I fund my account?",
    a: "Open the deposit page, send BTC, ETH or USDT (TRC20) to the address shown, then submit the transaction hash. Your balance is credited after the deposit is reviewed.",
  },
  {
    q: "What is the minimum deposit?",
    a: "The minimum deposit is $10. Each plan also has its own minimum and maximum investment amount, shown on the plan.",
  },
  {
    q: "How do withdrawals work?",
    a: "Request a withdrawal from your dashboard with the amount and your wallet address. The amount is held straight away and sent after review. If a request is rejected, the amount returns to your balance.",
  },
  {
    q: "What happens when a plan ends?",
    a: "When the term ends the investment is settled and the payout is credited to your balance. The payout depends on the outcome and can be lower than the target.",
  },
 
  {
    q: "Can I use Smart Assets where I live?",
    a: "Rules for investment services differ by country. Check that it is lawful for you to use this service where you live before you create an account.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="border-t border-line py-20">
      <div className="mx-auto max-w-3xl px-4">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">FAQ</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-white md:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-xl text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mist">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}