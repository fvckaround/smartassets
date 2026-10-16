import Reveal from "./Reveal";

const features = [
  {
    title: "Published plan terms",
    text: "Minimum, maximum, duration, target return and risk level are listed on every plan before you commit.",
  },
  {
    title: "Reviewed deposits",
    text: "Submit your transaction hash and each deposit is checked before it is credited to your balance.",
  },
  {
    title: "Reviewed withdrawals",
    text: "Withdrawal amounts are held when you request them and returned to your balance if a request is rejected.",
  },
  {
    title: "Complete history",
    text: "Deposits, investments, settlements and withdrawals all appear in your account with their status.",
  },
  {
    title: "Email notifications",
    text: "Get an email when a deposit, investment or withdrawal request is received or reviewed.",
  },
  {
    title: "Live market view",
    text: "Follow the top 20 cryptocurrencies by market cap, with prices that refresh every minute.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">Why Smart Assets</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-white md:text-4xl">
            Everything you need in one account
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-mist">
            A clear, simple platform that shows you what you are investing in and where your money is at every step.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="h-full">
              <div className="card h-full p-6 transition hover:border-gold/60">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-gold/15 text-sm font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-medium text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}