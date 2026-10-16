import mongoose from "mongoose";

// Audit trail for every manual balance change made by an admin.
const BalanceAdjustmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["add", "deduct"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    note: { type: String, required: true, trim: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.BalanceAdjustment ||
  mongoose.model("BalanceAdjustment", BalanceAdjustmentSchema);