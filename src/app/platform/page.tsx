import { Metadata } from "next";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SimulationDemo } from "@/components/sections/SimulationDemo";
import { ArrowRight, Zap, Shield, BarChart3, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Platform | EXPRESSO AI",
  description: "The full EXPRESSO AI platform — adaptive AI simulations, real-time behavioral scoring, and enterprise analytics in one infrastructure layer.",
};

const pillars = [
  {
    icon: <Zap size={22} className="text-[#8b5a2b]" />,
    title: "Adaptive Simulation Engine",
    description: "AI personas that dynamically escalate pressure, shift tactics, and respond to your emotional signals in real time — not scripted responses.",
  },
  {
    icon: <BarChart3 size={22} className="text-emerald-500" />,
    title: "Behavioral Scoring Engine",
    description: "500+ micro-dimensions analyzed per session: persuasion, clarity, emotional control, objection handling, and communication structure.",
  },
  {
    icon: <Layers size={22} className="text-blue-500" />,
    title: "Replay Intelligence",
    description: "Every session generates a full breakdown — missed opportunities, persuasion insights, emotional transitions, and coaching recommendations.",
  },
  {
    icon: <Shield size={22} className="text-violet-500" />,
    title: "Enterprise Infrastructure",
    description: "SOC2 Type II compliant. Private deployment available. Custom personas trained on your playbooks, products, and buyer profiles.",
  },
];

export default function PlatformPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">The Platform</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Behavioral Intelligence<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">Infrastructure</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto mb-10 leading-relaxed">
            One platform to simulate, score, and scale human communication performance across your entire organization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/ukkukk97/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
            >
              Book Enterprise Pilot <ArrowRight size={18} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-[#c4b094] text-[#2c1e16] px-8 py-4 rounded-lg font-semibold hover:bg-[#e8decb] transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-24 px-6 border-t border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Core Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Four layers. One platform.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="bg-[#fdfbf7] border border-[#d4c3ab] rounded-2xl p-8 hover:border-[#c4b094] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#f4ebd8] border border-[#d4c3ab] flex items-center justify-center mb-6">
                  {p.icon}
                </div>
                <h3 className="text-xl font-bold text-[#2c1e16] mb-3">{p.title}</h3>
                <p className="text-[#6e5646] leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Simulation Demo */}
      <SimulationDemo />

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#e3d5c1] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Ready to deploy?</h2>
          <p className="text-[#6e5646] mb-8">Book a 30-minute pilot call and we'll walk you through a live simulation tailored to your team.</p>
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
