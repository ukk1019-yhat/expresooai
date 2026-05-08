import { Metadata } from "next";
import { SimulationDemo } from "@/components/sections/SimulationDemo";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Simulations | EXPRESSO AI",
  description: "Adaptive AI simulation environments for negotiation, sales, leadership, and customer support training.",
};

const scenarios = [
  {
    tag: "Sales",
    title: "Enterprise Procurement Negotiation",
    description: "A skeptical CFO pushing back on pricing, demanding ROI proof, and threatening to go with a competitor.",
    pressure: "High",
    dimensions: ["Persuasion", "Value Framing", "Objection Handling"],
  },
  {
    tag: "Leadership",
    title: "Crisis Communication Briefing",
    description: "A board of directors demanding answers after a product outage. Manage expectations under extreme pressure.",
    pressure: "Extreme",
    dimensions: ["Emotional Control", "Clarity", "Authority"],
  },
  {
    tag: "Hiring",
    title: "Candidate Behavioral Interview",
    description: "An AI candidate giving vague answers. Probe deeper, assess culture fit, and make a hiring recommendation.",
    pressure: "Medium",
    dimensions: ["Active Listening", "Judgment", "Empathy"],
  },
  {
    tag: "Support",
    title: "Irate Customer Escalation",
    description: "A long-term customer threatening to churn after a billing error. De-escalate, retain, and rebuild trust.",
    pressure: "High",
    dimensions: ["Empathy", "De-escalation", "Problem Solving"],
  },
  {
    tag: "Sales",
    title: "Multi-Stakeholder Discovery Call",
    description: "Three personas with conflicting priorities — IT, Finance, and Operations — all on the same call.",
    pressure: "High",
    dimensions: ["Adaptability", "Listening", "Consensus Building"],
  },
  {
    tag: "Leadership",
    title: "Difficult Performance Review",
    description: "A high-performing employee who has become disengaged. Deliver honest feedback while preserving the relationship.",
    pressure: "Medium",
    dimensions: ["Emotional Intelligence", "Directness", "Coaching"],
  },
];

const pressureColor: Record<string, string> = {
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  High: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Extreme: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function SimulationsPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Simulation Library</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Practice the conversations<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">that matter most.</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto leading-relaxed">
            Adaptive AI personas that respond to your tone, pacing, and strategy in real time. No scripts. No predictable outcomes.
          </p>
        </div>
      </section>

      {/* Live Demo */}
      <SimulationDemo />

      {/* Scenario Library */}
      <section className="py-24 px-6 border-t border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Scenario Library</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Built for real-world pressure.</h2>
            <p className="text-[#6e5646] mt-4 max-w-xl">Enterprise customers can also upload their own transcripts and playbooks to generate custom scenarios.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((s, i) => (
              <div key={i} className="bg-[#fdfbf7] border border-[#d4c3ab] rounded-2xl p-6 hover:border-[#c4b094] transition-all flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b] bg-[#f4ebd8] border border-[#d4c3ab] px-3 py-1 rounded-full">{s.tag}</span>
                  <span className={`text-xs font-semibold border px-3 py-1 rounded-full ${pressureColor[s.pressure]}`}>{s.pressure} Pressure</span>
                </div>
                <h3 className="text-lg font-bold text-[#2c1e16]">{s.title}</h3>
                <p className="text-sm text-[#6e5646] leading-relaxed flex-1">{s.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e3d5c1]">
                  {s.dimensions.map((d) => (
                    <span key={d} className="text-xs text-[#826a57] bg-[#f4ebd8] px-2 py-1 rounded-md">{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#e3d5c1] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Want custom scenarios for your team?</h2>
          <p className="text-[#6e5646] mb-8">Enterprise customers can build scenarios from their own playbooks, CRM data, and past call transcripts.</p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book Enterprise Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
