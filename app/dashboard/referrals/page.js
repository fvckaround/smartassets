import { getCurrentUser, money } from "@/lib/session";
import User from "@/models/User";
import ReferralBonus from "@/models/ReferralBonus";
import { ensureReferralCode, REFERRAL_PERCENT } from "@/lib/referral";
import CopyButton from "@/components/CopyButton";

export const metadata = { title: "Referrals" };
export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const user = await getCurrentUser();
  const code = await ensureReferralCode(user._id);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const link = siteUrl ? `${siteUrl}/register?ref=${code}` : "";

  const [referred, bonuses] = await Promise.all([
    User.find({ referredBy: user._id }).select("name createdAt").sort({ createdAt: -1 }).limit(200).lean(),
    ReferralBonus.find({ referrer: user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("referred", "name")
      .lean(),
  ]);

  const totals = await ReferralBonus.aggregate([
    { $match: { referrer: user._id } },
    { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);
  const totalEarned = totals[0]?.total || 0;
  const bonusCount = totals[0]?.count || 0;

  // Total earned per referred person
  const earnedBy = {};
  for (const b of bonuses) {
    const id = b.referred?._id?.toString();
    if (id) earnedBy[id] = (earnedBy[id] || 0) + b.amount;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold text-white">Referrals</h1>
      <p className="mt-1 text-sm text-mist">
        Invite friends and earn {REFERRAL_PERCENT}% of every deposit they make, every time, added straight to your
        available balance once the deposit is approved.
      </p>

      <div className="card mt-8 p-6">
        <p className="text-sm text-mist">Your referral link</p>
        {link ? (
          <div className="mt-2 flex items-center gap-3">
            <code className="min-w-0 flex-1 break-all rounded-lg border border-line bg-ink px-3 py-2 text-sm text-gold-soft">
              {link}
            </code>
            <CopyButton text={link} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-mist">Share your code below with friends so they can enter it when they sign up.</p>
        )}
        <p className="mt-5 text-sm text-mist">Your referral code</p>
        <div className="mt-2 flex items-center gap-3">
          <code className="rounded-lg border border-line bg-ink px-3 py-2 text-lg tracking-widest text-white">{code}</code>
          <CopyButton text={code} />
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-mist">People referred</p>
          <p className="mt-2 text-3xl font-semibold text-white">{referred.length}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-mist">Bonuses earned</p>
          <p className="mt-2 text-3xl font-semibold text-white">{bonusCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-mist">Total referral earnings</p>
          <p className="gold-text mt-2 text-3xl font-semibold">{money(totalEarned)}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">People you referred</h2>
        <div className="card mt-4 overflow-x-auto">
          {referred.length === 0 ? (
            <p className="p-6 text-sm text-mist">No one has signed up with your link yet.</p>
          ) : (
            <table className="stack w-full text-left text-sm xl:min-w-[480px]">
              <thead className="text-mist">
                <tr className="border-b border-line">
                  <th className="p-4 font-normal">Name</th>
                  <th className="p-4 font-normal">Joined</th>
                  <th className="p-4 font-normal">You earned</th>
                </tr>
              </thead>
              <tbody>
                {referred.map((r) => (
                  <tr key={r._id.toString()} className="border-b border-line/60 last:border-0">
                    <td data-label="Name" className="full p-4 text-white">
                      {r.name}
                    </td>
                    <td data-label="Joined" className="p-4">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td data-label="You earned" className="p-4">
                      {money(earnedBy[r._id.toString()] || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Bonus history</h2>
        <div className="card mt-4 overflow-x-auto">
          {bonuses.length === 0 ? (
            <p className="p-6 text-sm text-mist">
              Bonuses appear here when a deposit from someone you referred is approved.
            </p>
          ) : (
            <table className="stack w-full text-left text-sm xl:min-w-[560px]">
              <thead className="text-mist">
                <tr className="border-b border-line">
                  <th className="p-4 font-normal">Date</th>
                  <th className="p-4 font-normal">From</th>
                  <th className="p-4 font-normal">Their deposit</th>
                  <th className="p-4 font-normal">Rate</th>
                  <th className="p-4 font-normal">Your bonus</th>
                </tr>
              </thead>
              <tbody>
                {bonuses.map((b) => (
                  <tr key={b._id.toString()} className="border-b border-line/60 last:border-0">
                    <td data-label="Date" className="p-4">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td data-label="From" className="p-4 text-white">
                      {b.referred?.name || "Member"}
                    </td>
                    <td data-label="Their deposit" className="p-4">
                      {money(b.depositAmount)}
                    </td>
                    <td data-label="Rate" className="p-4">
                      {b.percent}%
                    </td>
                    <td data-label="Your bonus" className="p-4 text-gold">
                      +{money(b.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}