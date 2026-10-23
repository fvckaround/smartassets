import mongoose from "mongoose";

// A loan application. Approving credits the amount to the user's balance (see /api/admin/loans/[id]).
const LoanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    durationDays: { type: Number, required: true, min: 1 },
    purpose: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending", index: true },
    adminNote: { type: String, default: "", maxlength: 1000 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    dueAt: { type: Date }, // set on approval: reviewedAt + durationDays
  },
  { timestamps: true }
);

export default mongoose.models.Loan || mongoose.model("Loan", LoanSchema);
