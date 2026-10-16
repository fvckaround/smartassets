// Optional questions on the registration form. Answers are shown to the admin on the Users page.
export const FOUND_US_OPTIONS = [
  "Google search",
  "Facebook",
  "Instagram",
  "X (Twitter)",
  "TikTok",
  "YouTube",
  "Telegram / WhatsApp",
  "Friend or family",
  "Online advert",
  "Other",
];

export const cleanFoundUs = (v) => {
  const s = String(v || "").trim();
  return FOUND_US_OPTIONS.includes(s) ? s : "";
};

export const cleanRating = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined;
};

export const stars = (n) => (n ? "★".repeat(n) + "☆".repeat(5 - n) : "");