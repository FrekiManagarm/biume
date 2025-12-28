import { HeroSection } from "./hero";
import { FeaturesSection } from "./features";
import { PricingSection } from "./pricing-section";
import { CTASection } from "@/components/landing-legacy/sections/cta-section";
import LandingFooter from "./footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}

