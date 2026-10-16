// Optional free-text questions on the registration form.
// Answers are shown to the admin on the Users page.
export const cleanText = (v, max = 300) => String(v || "").replace(/\s+/g, " ").trim().slice(0, max);