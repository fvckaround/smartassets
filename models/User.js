import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // Balance only ever changes through approved deposits, investment
    // settlement and approved withdrawals (see /api routes).
    balance: { type: Number, default: 0, min: 0 },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);