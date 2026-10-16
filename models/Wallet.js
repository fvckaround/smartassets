import mongoose from "mongoose";

// Deposit wallets are added and managed by an admin in /admin/wallets.
// Users only ever see wallets where active is true.
const WalletSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. Bitcoin
    symbol: { type: String, required: true, trim: true, uppercase: true }, // e.g. BTC
    network: { type: String, default: "", trim: true }, // e.g. TRC20 (optional)
    address: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);