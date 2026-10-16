import dbConnect from "@/lib/db";
import Wallet from "@/models/Wallet";

// Label stored on transactions, e.g. "USDT (TRC20)" or "BTC".
export const walletLabel = (w) => `${w.symbol}${w.network ? ` (${w.network})` : ""}`;

// Wallets the admin has marked Active. Users only ever see these.
export async function getActiveWallets() {
  await dbConnect();
  const wallets = await Wallet.find({ active: true }).sort({ createdAt: 1 }).lean();
  return wallets.map((w) => ({
    id: w._id.toString(),
    name: w.name,
    symbol: w.symbol,
    network: w.network || "",
    address: w.address,
    label: walletLabel(w),
  }));
}