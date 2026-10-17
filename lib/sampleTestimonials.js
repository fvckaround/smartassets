// SAMPLE testimonials shown while the site is in testing.
// They are clearly labelled "Sample" on the page. They disappear automatically as soon as you
// publish a real testimonial in the admin panel.
//
// To turn them off for good when you go live, set SHOW_SAMPLES to false below
// (or add NEXT_PUBLIC_SHOW_SAMPLE_TESTIMONIALS=false in Vercel).
export const SHOW_SAMPLES = process.env.NEXT_PUBLIC_SHOW_SAMPLE_TESTIMONIALS !== "false";

export const SAMPLE_TESTIMONIALS = [
  {
    id: "sample-1",
    name: "james sane",
    location: "Sydney, Australia",
    text: "The dashboard is clear and easy to follow. I can see my plan, the dates and the target in one place.",
  },
  {
    id: "sample-2",
    name: "Lim Jun Kai",
    location: "Singapore",
    text: "Signing up took a few minutes, and the plan terms were explained clearly before I decided anything.",
  },
  {
    id: "sample-3",
    name: "wayne phils",
    location: "London, United Kingdom",
    text: "I liked that the risks are stated openly. Support answered my questions quickly on WhatsApp.",
  },
  {
    id: "sample-4",
    name: "Ali Hassan",
    location: "Dubai, United Arab Emirates",
    text: "The site is simple to use on my phone, and I get email updates when something changes on my account.",
  },
  {
    id: "sample-5",
    name: "olivia Grace",
    location: "Toronto, Canada",
    text: "The referral page makes it easy to share my link and see who has joined through it.",
  },
];