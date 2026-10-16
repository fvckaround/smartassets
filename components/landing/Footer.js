import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-mist">
              Smart Assets Global Trade offers digital-asset investment plans with published terms and clear risk
              disclosure.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm">
            <div>
              <p className="mb-3 font-medium text-white">Account</p>
              <ul className="space-y-2 text-mist">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Create account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-medium text-white">Legal</p>
              <ul className="space-y-2 text-mist">
                <li>
                  <Link href="/risk-disclosure" className="hover:text-white">
                    Risk disclosure
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-mist">
          Risk warning: digital assets are volatile and you can lose some or all of the money you invest. Target
          returns are not guaranteed. This site does not provide financial, legal or tax advice.
        </p>
        <p className="mt-3 text-xs text-mist">
          © {new Date().getFullYear()} Smart Assets Global Trade. All rights reserved.
        </p>
      </div>
    </footer>
  );
}