import { CTASection } from "./cta-section";
import { MissionSection } from "./mission-section";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { ValuesSection } from "./values-section";
import { TeamSection } from "./team-section";
import { Header } from "@/components/landing/header";

const AboutPageComponent = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />

      <main className="flex-1 pt-16">
        <HeroSection />
        <StatsSection />
        <MissionSection />
        <ValuesSection />
        <TeamSection />
        <CTASection />
      </main>
    </div>
  );
};

export default AboutPageComponent;
