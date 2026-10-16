import { randomBytes } from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Percent of EVERY approved deposit paid to the person who referred the depositor.
export const REFERRAL_PERCENT = 10;

// No 0/O/1/I/L so codes are easy to read and type.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateReferralCode(length = 8) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

// Returns the user's referral code, creating one if they don't have it yet.
export async function ensureReferralCode(userId) {
  await dbConnect();
  const existing = await User.findById(userId).select("referralCode").lean();
  if (existing?.referralCode) return existing.referralCode;

  for (let i = 0; i < 8; i++) {
    const code = generateReferralCode();
    try {
      await User.updateOne({ _id: userId, referralCode: { $in: [null, ""] } }, { referralCode: code });
      const fresh = await User.findById(userId).select("referralCode").lean();
      if (fresh?.referralCode) return fresh.referralCode;
    } catch (err) {
      if (err?.code !== 11000) throw err; // 11000 = code already used, try another
    }
  }
  throw new Error("Could not create a referral code.");
}