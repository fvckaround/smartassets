import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // Balance only ever changes through approved deposits, investment
    // settlement, approved withdrawals, referral bonuses and admin adjustments (see /api routes).
    balance: { type: Number, default: 0, min: 0 },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    // Referrals: each user has a shareable code; referredBy is set once, at registration.
    referralCode: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    // Optional registration survey
    foundUs: { type: String, default: "", trim: true, maxlength: 200 },
    rating: { type: String, default: "", trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);