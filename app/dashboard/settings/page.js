import Link from "next/link";
import { getCurrentUser, money } from "@/lib/session";
import { ensureReferralCode } from "@/lib/referral";
import { ProfileForm, PasswordForm } from "./SettingsForms";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

const dateFmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function SettingsPage() {
  const user = await getCurrentUser();
  let code = user.referralCode;
  try {
    if (!code) code = await ensureReferralCode(user._id);
  } catch {
    code = "";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold text-white">Settings</h1>
      <p className="mt-1 text-sm text-mist">Manage your profile, password and account details.</p>

      <div className="card mt-8 grid gap-4 p-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs text-mist">Email</p>
          <p className="break-all text-white">{user.email}</p>
          <p className="mt-1 text-xs text-mist">
            To change your email, <Link href="/contact" className="underline">contact support</Link>.
          </p>
        </div>
        <div>
          <p className="text-xs text-mist">Member since</p>
          <p className="text-white">{dateFmt(user.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-mist">Available balance</p>
          <p className="text-white">{money(user.balance)}</p>
        </div>
        <div>
          <p className="text-xs text-mist">Referral code</p>
          <p className="notranslate text-white">{code || "—"}</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <ProfileForm initial={{ name: user.name || "", phone: user.phone || "", country: user.country || "" }} />
        <PasswordForm />
      </div>
    </div>
  );
}