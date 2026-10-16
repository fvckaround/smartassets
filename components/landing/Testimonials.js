import Reveal from "./Reveal";

// Renders only real, published testimonials from the database.
// With none published, the whole section is hidden.
export default function Testimonials({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.22em] text-gold">Client feedback</p>
          <h2 className="mt-3 text-center text-3xl font-semibold text-white md:text-4xl">
            What our clients say
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full">
              <figure className="card flex h-full flex-col p-6">
                <blockquote className="text-sm leading-relaxed text-mist">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-5 border-t border-line pt-4">
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  {t.location && <p className="text-xs text-mist">{t.location}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}