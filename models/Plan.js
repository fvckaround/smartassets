import mongoose from "mongoose";

// Plans are created and edited by an admin. Nothing about returns is
// hardcoded on the public site; the landing page reads these records.
const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    minAmount: { type: Number, required: true, min: 1 },
    maxAmount: { type: Number, required: true, min: 1 },
    // Target return over the whole duration, in percent. This is a target, not a guarantee.
    targetReturnPercent: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1 },
    riskLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);