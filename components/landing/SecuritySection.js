import Reveal from "./Reveal";

const points = [
  {
    title: "Hashed passwords",
    text: "Passwords are stored as one-way bcrypt hashes. Nobody, including our team, can read your password.",
  },
  {
    title: "Signed sessions",
    text: "Sign-in sessions use signed tokens, and suspended accounts are blocked from signing in.",
  },
  {
    title: "Restricted admin area",
    text: "The review and management area is limited to administrator accounts and checked on every request.",
  },
  {
    title: "Held withdrawal funds",
    text: "When you request a withdrawal the amount is set aside immediately, so it cannot be spent twice.",
  },
  {
    title: "Reviewed transactions",
    text: "Deposits and withdrawals are individually reviewed and each decision is recorded against your account.",
  },
  {
    title: "Your account only",
    text: "You can only see and act on your own balance, investments and history.",
  },
];

export default function SecuritySection() {
  return (
    <section id="security" className="border-y border-line bg-navy/60 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">Security</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-white md:text-4xl">
            How we protect your account
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-mist">
            These are the safeguards built into the platform. Keep your password private and use one you do not use
            anywhere else.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="h-full">
              <div className="card h-full p-6">
                <h3 className="text-lg font-medium text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-mist">
          Strong security does not remove investment risk. The value of digital assets can fall, and you can lose some
          or all of your capital.
        </p>
      </div>
    </section>
  );
}