import { HeroSection } from "./sections/hero-section";
import { FeaturesSection } from "./sections/features-section";
import { PricingSection } from "./sections/pricing-section";
import { CTASection } from "./sections/cta-section";
import LandingFooter from "./footer";

export async function LandingPage() {
  return (
    <div className="h-full w-full overflow-x-hidden">
      <main className="w-full">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
