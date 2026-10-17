import dbConnect from "@/lib/db";
import Plan from "@/models/Plan";
import Testimonial from "@/models/Testimonial";
import LandingContent from "./LandingContent";
import { SAMPLE_TESTIMONIALS, SHOW_SAMPLES } from "@/lib/sampleTestimonials";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getData() {
  try {
    await dbConnect();
    const [plans, testimonials] = await Promise.all([
      Plan.find({ active: true }).sort({ minAmount: 1 }).lean(),
      Testimonial.find({ published: true }).sort({ createdAt: -1 }).limit(6).lean(),
    ]);

    return {
      plans: plans.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        minAmount: p.minAmount,
        maxAmount: p.maxAmount,
        targetReturnPercent: p.targetReturnPercent,
        durationDays: p.durationDays,
        riskLevel: p.riskLevel,
      })),
      testimonials: testimonials.map((t) => ({
        id: t._id.toString(),
        name: t.name,
        location: t.location,
        text: t.text,
      })),
    };
  } catch (err) {
    console.error("landing data error:", err);
    return { plans: [], testimonials: [] };
  }
}

export default async function HomePage() {
  const data = await getData();
  const { plans } = data;
  // Until a real testimonial is published, show clearly labelled SAMPLE testimonials (while testing).
  const sample = SHOW_SAMPLES && data.testimonials.length === 0;
  const testimonials = sample ? SAMPLE_TESTIMONIALS : data.testimonials;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Smart Assets Global Trade",
    url: SITE_URL,
    description:
      "Investment company offering digital-asset investment plans with transparent terms and clear risk disclosure.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingContent plans={plans} testimonials={testimonials} testimonialsSample={sample} />
    </>
  );
}