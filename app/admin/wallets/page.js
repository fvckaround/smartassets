import dbConnect from "@/lib/db";
import Wallet from "@/models/Wallet";
import WalletManager from "@/components/WalletAdmin";

export const metadata = { title: "Wallets" };
export const dynamic = "force-dynamic";

export default async function AdminWalletsPage() {
  await dbConnect();
  const wallets = await Wallet.find().sort({ createdAt: 1 }).lean();

  const serialized = wallets.map((w) => ({
    id: w._id.toString(),
    name: w.name,
    symbol: w.symbol,
    network: w.network || "",
    address: w.address,
    active: w.active,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold text-white">Deposit wallets</h1>
      <p className="mt-1 text-sm text-mist">
        Add the coins and addresses users can deposit to. Only wallets marked Active appear on the user deposit
        page. Double-check every address you enter, because sent crypto cannot be recovered.
      </p>
      <WalletManager wallets={serialized} />
    </div>
  );
}