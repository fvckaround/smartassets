// Shared validation for ambassador packages (used by the admin API routes).
export function readPackage(b) {
  const kind = b.kind === "reward" ? "reward" : "package";
  const pkg = {
    kind,
    name: String(b.name || "").trim().slice(0, 80),
    benefits: String(b.benefits || "")
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join("\n")
      .slice(0, 3000),
    price: kind === "reward" ? Number(b.price) || 0 : Number(b.price),
    maxLabel: String(b.maxLabel || "").trim().slice(0, 40) || "Unlimited",
    order: Number.isFinite(Number(b.order)) ? Number(b.order) : 0,
  };
  if (!pkg.name) return { error: "Package name is required." };
  if (!pkg.benefits) return { error: kind === "reward" ? "Add at least one reward line." : "Add at least one benefit." };
  if (!Number.isFinite(pkg.price) || pkg.price < 0) return { error: "Enter a valid price." };
  return { pkg };
}
