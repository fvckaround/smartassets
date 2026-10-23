import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import { money } from "@/lib/session";
import { PackageForm, PackageActions } from "@/components/PackageAdmin";

export const metadata = { title: "Ambassador packages" };
export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  await dbConnect();
  const items = await Package.find().sort({ order: 1, createdAt: 1 }).lean();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-white">Packages and rewards</h1>
      <p className="mt-1 text-sm text-[var(--color-mist)]">
        Published rewards and ambassador packages appear on the home page, right after the investment plans.
      </p>

      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <p className="card p-6 text-sm text-[var(--color-mist)]">Nothing yet. Create the first one below.</p>
        ) : (
          items.map((p) => (
            <div key={p._id.toString()} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-gold)]">
                    {p.kind === "reward" ? "Reward" : "Ambassador package"}
                  </p>
                  <p className="text-lg text-white">{p.name}</p>
                  {p.kind !== "reward" && (
                    <p className="text-sm text-[var(--color-mist)]">
                      {money(p.price)} · {p.maxLabel}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs ${
                    p.published
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-white/20 text-[var(--color-mist)]"
                  }`}
                >
                  {p.published ? "Published" : "Hidden"}
                </span>
              </div>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[var(--color-mist)]">
                {p.benefits.split("\n").map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ol>
              <div className="mt-4">
                <PackageActions
                  pkg={{
                    id: p._id.toString(),
                    kind: p.kind || "package",
                    name: p.name,
                    benefits: p.benefits,
                    price: p.price,
                    maxLabel: p.maxLabel,
                    order: p.order,
                    published: p.published,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <h2 className="mt-10 text-xl text-white">Create a package or reward</h2>
      <div className="mt-4">
        <PackageForm />
      </div>
    </div>
  );
}
