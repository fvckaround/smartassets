import "./globals.css";
import TranslateLoader from "@/components/TranslateLoader";
import WhatsAppButton from "@/components/WhatsAppButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Smart Assets | Global Trade Investment Company",
    template: "%s | Smart Assets Global Trade",
  },
  description:
    "Smart Assets Global Trade is an investment company offering digital-asset investment plans with transparent terms, clear risk disclosure and a simple account dashboard.",
  openGraph: {
    title: "Smart Assets | Global Trade Investment Company",
    description:
      "Digital-asset investment plans with transparent terms and clear risk disclosure.",
    url: SITE_URL,
    siteName: "Smart Assets Global Trade",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#070c17",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <LanguageSwitcher floating />
        <WhatsAppButton />
        <TranslateLoader />
      </body>
    </html>
  );
}