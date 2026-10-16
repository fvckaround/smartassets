import RequestForm from "@/components/RequestForm";
import CopyButton from "@/components/CopyButton";
import { getActiveWallets } from "@/lib/wallets";

export const metadata = { title: "Deposit" };
export const dynamic = "force-dynamic";

export default async function DepositPage() {
  const wallets = await getActiveWallets();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold text-white">Deposit</h1>
      <p className="mt-1 text-sm text-mist">
        Send crypto to one of the addresses below, then submit the transaction hash. Your balance is credited after
        the transfer is confirmed and reviewed.
      </p>

      {wallets.length === 0 ? (
        <div className="card mt-8 p-6 text-sm text-mist">
          No deposit methods are available right now. Please check back soon.
        </div>
      ) : (
        <>
          <div className="card mt-8 divide-y divide-line">
            {wallets.map((w) => (
              <div key={w.id} className="p-5">
                <p className="text-sm text-white">
                  {w.name} <span className="text-mist">({w.symbol})</span>
                </p>
                {w.network && <p className="mt-1 text-xs text-mist">Network: {w.network}</p>}
                <div className="mt-2 flex items-center gap-3">
                  <code className="break-all text-sm text-gold">{w.address}</code>
                  <CopyButton text={w.address} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-mist">
            Always double-check the address and network before sending. Crypto transfers cannot be reversed.
          </p>

          <div className="card mt-8 p-6">
            <h2 className="text-xl font-semibold text-white">Confirm your transfer</h2>
            <div className="mt-5">
              <RequestForm
                endpoint="/api/deposits"
                submitLabel="Submit deposit for review"
                successMessage="Deposit submitted. It will be credited once confirmed."
                methodLabel="Coin you sent"
                methods={wallets.map((w) => ({ value: w.id, label: w.label }))}
                fields={[
                  { name: "amount", label: "Amount sent (USD value)", type: "number", min: 10, placeholder: "e.g. 500" },
                  { name: "reference", label: "Transaction hash / reference", placeholder: "Paste your transaction hash" },
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}