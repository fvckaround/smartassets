import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Returns the fresh, active DB user for the current session, or null.
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  await dbConnect();
  const user = await User.findById(session.user.id).lean();
  if (!user || user.status !== "active") return null;
  return user;
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export const money = (n) =>
  Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });