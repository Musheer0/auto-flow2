import { AIDemoSection } from "./(marketing)/components/AIDemoSection";
import { DataFlowAnimation } from "./(marketing)/components/DataFlowAnimation";
import { EngineDiagram } from "./(marketing)/components/EngineDiagram";
import { FeatureBentoGrid } from "./(marketing)/components/FeatureBentoGrid";
import { FinalCTA } from "./(marketing)/components/FinalCTA";
import { Footer } from "./(marketing)/components/Footer";
import { Hero } from "./(marketing)/components/Hero";
import { HowItWorks } from "./(marketing)/components/HowItWorks";
import { LogoStrip } from "./(marketing)/components/LogoStrip";
import { Navbar } from "./(marketing)/components/Navbar";
import { NodeExplorer } from "./(marketing)/components/NodeExplorer";
import { OpenSourceCallout } from "./(marketing)/components/OpenSourceCallout";
import { PricingSection } from "./(marketing)/components/PricingSection";
import { ProductShowcase } from "./(marketing)/components/ProductShowcase";
import { UseCases } from "./(marketing)/components/UseCases";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <HowItWorks />
        <AIDemoSection />
        <FeatureBentoGrid />
        <ProductShowcase />
        <NodeExplorer />
        <DataFlowAnimation />
        <EngineDiagram />
        <UseCases />
        <PricingSection />
        <OpenSourceCallout />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
