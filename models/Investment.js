import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    planName: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    targetReturnPercent: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date, required: true },
    // Settled by an admin once the term ends; payout is whatever the admin records.
    status: { type: String, enum: ["active", "settled", "cancelled"], default: "active" },
    payoutAmount: { type: Number, default: 0 },
    settledAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);