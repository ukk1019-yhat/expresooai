import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SimulationDemo } from "@/components/sections/SimulationDemo";
import { UseCases } from "@/components/sections/UseCases";
import { Comparison } from "@/components/sections/Comparison";
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";
import { Architecture } from "@/components/sections/Architecture";
import { SocialProof } from "@/components/sections/SocialProof";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <SimulationDemo />
      <UseCases />
      <Comparison />
      <AnalyticsDashboard />
      <Architecture />
      <SocialProof />
      <FinalCTA />
    </>
  );
}
