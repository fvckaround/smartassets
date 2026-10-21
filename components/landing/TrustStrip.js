import Reveal from "./Reveal";

const items = [
  { title: "Published terms", text: "Minimum, maximum, duration and risk level are shown on every plan." },
  { title: "Reviewed transfers", text: "Each deposit and withdrawal is checked before it is processed." },
  { title: "Plain risk disclosure", text: "Targets are guaranted. Read it before you invest." },
  { title: "Full activity history", text: "Every deposit, investment and withdrawal in one place." },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-line bg-navy/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06}>
            <p className="text-sm font-medium text-white">{it.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-mist">{it.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}