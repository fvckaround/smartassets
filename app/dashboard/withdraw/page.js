import RequestForm from "@/components/RequestForm";
import { getCurrentUser, money } from "@/lib/session";
import { getActiveWallets } from "@/lib/wallets";

export const metadata = { title: "Withdraw" };
export const dynamic = "force-dynamic";

export default async function WithdrawPage() {
  const user = await getCurrentUser();
  const wallets = await getActiveWallets();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold text-white">Withdraw</h1>
      <p className="mt-1 text-sm text-mist">
        Available balance: <span className="text-white">{money(user.balance)}</span>. The requested amount is held
        immediately and returned to your balance if the request is rejected.
      </p>

      {wallets.length === 0 ? (
        <div className="card mt-8 p-6 text-sm text-mist">
          No withdrawal methods are available right now. Please check back soon.
        </div>
      ) : (
        <div className="card mt-8 p-6">
          <RequestForm
            endpoint="/api/withdrawals"
            submitLabel="Request withdrawal"
            successMessage="Withdrawal requested. We will review and process it shortly."
            methodLabel="Receive as"
            methods={wallets.map((w) => ({ value: w.id, label: w.label }))}
            fields={[
              { name: "amount", label: "Amount (USD)", type: "number", min: 10, placeholder: "e.g. 250" },
              { name: "address", label: "Your wallet address", placeholder: "Paste the destination address" },
            ]}
          />
        </div>
      )}
    </div>
  );
}