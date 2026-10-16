import { redirect } from "next/navigation";
import DashShell from "@/components/DashShell";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/deposit", label: "Deposit" },
  { href: "/dashboard/invest", label: "Invest" },
  { href: "/dashboard/withdraw", label: "Withdraw" },
  { href: "/dashboard/referrals", label: "Referrals" },
];

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const allLinks = user.role === "admin" ? [...links, { href: "/admin", label: "Admin panel" }] : links;

  return (
    <DashShell user={{ name: user.name, email: user.email }} links={allLinks}>
      {children}
    </DashShell>
  );
}