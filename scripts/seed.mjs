// Creates (or promotes) the first admin account.
// Usage (Windows CMD), from the project folder:
//   set "ADMIN_EMAIL=you@example.com"
//   set "ADMIN_PASSWORD=YourStrongPassword"
//   node --env-file=.env scripts/seed.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI } = process.env;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "").trim();

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set MONGODB_URI (in .env), ADMIN_EMAIL and ADMIN_PASSWORD first.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 10) {
  console.error("Use an admin password of at least 10 characters.");
  process.exit(1);
}

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true, lowercase: true },
        password: String,
        role: { type: String, default: "user" },
        balance: { type: Number, default: 0 },
        country: String,
        phone: String,
        status: { type: String, default: "active" },
      },
      { timestamps: true }
    )
  );

await mongoose.connect(MONGODB_URI);

const email = ADMIN_EMAIL.toLowerCase();
const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

const existing = await User.findOne({ email });
if (existing) {
  existing.role = "admin";
  existing.password = hash;
  existing.status = "active";
  await existing.save();
  console.log(`Updated existing user ${email} to admin.`);
} else {
  await User.create({ name: "Administrator", email, password: hash, role: "admin" });
  console.log(`Created admin ${email}.`);
}

await mongoose.disconnect();