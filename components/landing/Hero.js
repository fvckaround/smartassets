"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function Hero() {
  return (
    <section className="bg-grid relative overflow-hidden bg-ink">
      {/* Background photo: save your image as public/hero-bg.jpg. If it is missing, the dark green shows instead. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/75 to-ink"
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center md:py-32">
        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mb-5 w-fit rounded-full border border-line px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-gold"
        >
          Global Trade Investment Company
        </motion.p>

        <motion.h1
          variants={fade}
          custom={1}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
        >
          Digital-asset investing, <span className="gold-text">made clear.</span>
        </motion.h1>

        <motion.p
          variants={fade}
          custom={2}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-2xl text-base text-mist md:text-lg"
        >
          Smart Assets offers structured investment plans with published terms, a straightforward dashboard and honest
          risk disclosure. Understand exactly what you are signing up for before you invest.
        </motion.p>

        <motion.div
          variants={fade}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/register" className="btn-gold w-full px-8 sm:w-auto">
            Create an account
          </Link>
          <a href="#plans" className="btn-ghost w-full px-8 sm:w-auto">
            View plans
          </a>
        </motion.div>

        <motion.p
          variants={fade}
          custom={4}
          initial="hidden"
          animate="show"
          className="mx-auto mt-8 max-w-xl text-xs text-mist"
        >
          Digital assets are volatile. Your capital is at risk and target returns are not guaranteed.
        </motion.p>
      </div>
    </section>
  );
}