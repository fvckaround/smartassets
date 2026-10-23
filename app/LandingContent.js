import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import MarketTicker from "@/components/landing/MarketTicker";
import TrustStrip from "@/components/landing/TrustStrip";
import LiveTransactions from "@/components/landing/LiveTransactions";
import PlansSection from "@/components/landing/PlansSection";
import PackagesSection from "@/components/landing/PackagesSection";
import MarketsSection from "@/components/landing/MarketsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProductPreview from "@/components/landing/ProductPreview";
import HowItWorks from "@/components/landing/HowItWorks";
import AssetsSection from "@/components/landing/AssetsSection";
import SecuritySection from "@/components/landing/SecuritySection";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import SupportCallout from "@/components/landing/SupportCallout";
import Footer from "@/components/landing/Footer";

export default function LandingContent({
  plans,
  packages = [],
  testimonials,
  testimonialsSample = false,
}) {
  return (
    <div className="min-h-screen">
      <Nav />

      <Hero />

      <MarketTicker />

      <TrustStrip />

      <LiveTransactions />

      <PlansSection plans={plans} />

      <PackagesSection packages={packages} />

      <MarketsSection />

      <FeaturesSection />

      <ProductPreview />

      <HowItWorks />

      <AssetsSection />

      <SecuritySection />

      <Testimonials
        items={testimonials}
        sample={testimonialsSample}
      />

      <FAQSection />

      <SupportCallout />

      <Footer />
    </div>
  );
}