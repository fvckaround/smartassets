import mongoose from "mongoose";

// One row per approved deposit that earned a referral bonus.
// The unique index on `transaction` guarantees a deposit can never pay a bonus twice.
const ReferralBonusSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    referred: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true, unique: true },
    depositAmount: { type: Number, required: true },
    percent: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ReferralBonus || mongoose.model("ReferralBonus", ReferralBonusSchema);