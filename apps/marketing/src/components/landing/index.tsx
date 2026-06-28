import { HeroSection } from "./hero";
import { StorySection } from "./story-section";
import { FeaturesSection } from "./features";
import { PricingSection } from "./pricing-section";
import { CTASection } from "./cta-section";
import LandingFooter from "./footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <main>
        <HeroSection />
        <StorySection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
