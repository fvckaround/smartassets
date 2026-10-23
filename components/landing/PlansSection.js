import Link from "next/link";
import Reveal from "./Reveal";
import { REFERRAL_PERCENT } from "@/lib/referral";
import PlanCard from "@/components/PlanCard";

export default function PlansSection({ plans }) {
  return (
    <section id="plans" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-display text-3xl text-white md:text-4xl">Investment plans</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-mist">
          Figures below are target returns over the full plan duration. They are guaranteed and your capital is at
          safe.
        </p>

        {plans.length === 0 ? (
          <p className="card mx-auto mt-12 max-w-xl p-8 text-center text-mist">
            Plans are being finalised and will be published here soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} className="h-full">
                <PlanCard
                  plan={p}
                  referralPercent={REFERRAL_PERCENT}
                  action={
                    <Link href="/register" className="btn-gold inline-block px-8">
                      Select Plan
                    </Link>
                  }
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}