import Link from "next/link";
import Reveal from "./Reveal";

export default function SupportCallout() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "smartassetsglobal@gmail.com";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <Reveal>
          <div className="card bg-grid p-10 text-center">
            <h2 className="text-3xl font-semibold text-white">How can we help?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-mist">
              Ready to take a closer look? Create an account and explore the plans, or get in touch if you have a
              question first.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="btn-gold w-full px-8 sm:w-auto">
                Create an account
              </Link>
              {email ? (
                <Link href="/contact" className="btn-ghost w-full px-8 sm:w-auto">
                  Contact us
                </Link>
              ) : (
                <Link href="/risk-disclosure" className="btn-ghost w-full px-8 sm:w-auto">
                  Read the risk disclosure
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}