import Link from "next/link";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/contact";

export default function SupportCallout() {
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
              <Link href="/contact" className="btn-ghost w-full px-8 sm:w-auto">
                Contact us
              </Link>
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
        </Reveal>
      </div>
    </section>
  );
}