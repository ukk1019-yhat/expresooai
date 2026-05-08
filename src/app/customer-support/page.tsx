import { Metadata } from "next";
import { ArrowRight, TrendingDown, Heart, Zap, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Support | EXPRESSO AI",
  description: "Train support teams to de-escalate irate customers and handle complex edge cases — with AI simulations and real-time empathy scoring.",
};

const outcomes = [
  { icon: <TrendingDown size={20} className="text-emerald-500" />, stat: "50%", label: "Drop in Escalations", desc: "Teams trained on de-escalation simulations resolve more tickets at tier 1." },
  { icon: <Heart size={20} className="text-rose-500" />, stat: "Empathy", label: "Scoring", desc: "Objective measurement of empathy, tone, and emotional attunement in every session." },
  { icon: <Zap size={20} className="text-amber-500" />, stat: "Safe", label: "Practice Space", desc: "Agents practice on irate AI customers before handling real ones." },
  { icon: <BarChart2 size={20} className="text-blue-500" />, stat: "Team", label: "Benchmarks", desc: "Identify which agents need coaching and which are ready to handle escalations." },
];

const scenarios = [
  "Irate customer threatening to cancel after a billing error",
  "Long-term customer who received a defective product",
  "Frustrated user who has contacted support 3 times for the same issue",
  "Customer demanding a refund outside of policy",
  "Aggressive caller escalating to speak with a manager",
  "Complex technical issue with an emotionally distressed user",
];

export default function CustomerSupportPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Customer Support</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Build empathy and<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">de-escalation skills at scale.</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto mb-10 leading-relaxed">
            Simulate irate customers, complex edge cases, and high-pressure escalations — so your support team is prepared before they face the real thing.
          </p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book a Support Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Measurable Outcomes</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Fewer escalations. Happier customers.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outcomes.map((o, i) => (
              <div key={i} className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-4">{o.icon}</div>
                <div className="text-4xl font-bold text-[#2c1e16] mb-1">{o.stat}</div>
                <div className="text-sm font-semibold text-[#8b5a2b] uppercase tracking-wider mb-3">{o.label}</div>
                <p className="text-xs text-[#6e5646] leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Scenario Library</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-6">Every difficult customer interaction, simulated.</h2>
            <p className="text-[#6e5646] leading-relaxed mb-8">
              AI customers that escalate, repeat themselves, and test your agent's patience — just like the real ones.
            </p>
            <a
              href="https://calendly.com/ukkukk97/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#c4b094] text-[#2c1e16] px-6 py-3 rounded-lg font-semibold hover:bg-[#e8decb] transition-colors"
            >
              See a live demo <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {scenarios.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-[#fdfbf7] border border-[#d4c3ab] rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[#f4ebd8] border border-[#d4c3ab] flex items-center justify-center text-xs font-bold text-[#8b5a2b] flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm text-[#2c1e16]">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Cut escalations by 50%.</h2>
          <p className="text-[#6e5646] mb-8">Book a pilot and we'll design a simulation library around your most common and most difficult support scenarios.</p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book Support Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
