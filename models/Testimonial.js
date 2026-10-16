import mongoose from "mongoose";

// Only genuine testimonials from real clients should be stored here.
// The landing page shows nothing until at least one is published.
const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    text: { type: String, required: true, trim: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);