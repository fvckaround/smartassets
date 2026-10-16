import { redirect } from "next/navigation";
import DashShell from "@/components/DashShell";
import { getCurrentAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/wallets", label: "Wallets" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/investments", label: "Investments" },
  { href: "/admin/users", label: "Users" },
  { href: "/dashboard", label: "My dashboard" },
];

export default async function AdminLayout({ children }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  return (
    <DashShell user={{ name: admin.name, email: admin.email }} links={links} badge="Admin">
      {children}
    </DashShell>
  );
}