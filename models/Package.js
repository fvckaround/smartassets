import mongoose from "mongoose";

// Ambassador packages and reward tiers created by the admin and shown on the landing page.
// kind "package" = Ambassador package card (with price); kind "reward" = Rewards card (no price).
const PackageSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["package", "reward"], default: "package" },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    // One benefit per line; shown as a numbered list.
    benefits: { type: String, required: true, trim: true, maxlength: 3000 },
    price: { type: Number, default: 0, min: 0 },
    maxLabel: { type: String, default: "Unlimited", trim: true, maxlength: 40 },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model("Package", PackageSchema);
