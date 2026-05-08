import { Metadata } from "next";
import { ArrowRight, TrendingUp, Clock, Target, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sales Training | EXPRESSO AI",
  description: "AI-powered sales training that cuts ramp time by 35% — practice objection handling, pricing negotiations, and discovery calls with adaptive AI buyers.",
};

const outcomes = [
  { icon: <TrendingUp size={20} className="text-emerald-500" />, stat: "35%", label: "Faster Ramp Time", desc: "New reps reach quota faster by practicing on AI before burning live leads." },
  { icon: <Target size={20} className="text-[#8b5a2b]" />, stat: "15%", label: "Margin Preservation", desc: "Teams trained on pricing pressure simulations defend value more effectively." },
  { icon: <Clock size={20} className="text-blue-500" />, stat: "10×", label: "More Practice Reps", desc: "Unlimited AI simulations vs. limited manager roleplay time." },
  { icon: <BarChart2 size={20} className="text-violet-500" />, stat: "500+", label: "Dimensions Scored", desc: "Objective data on every rep's persuasion, clarity, and objection handling." },
];

const scenarios = [
  "Enterprise procurement negotiation with a skeptical CFO",
  "Multi-stakeholder discovery call with conflicting priorities",
  "Competitive displacement — defending against a cheaper alternative",
  "Pricing objection handling under budget pressure",
  "Late-stage deal rescue after a competitor undercut your price",
  "Upsell conversation with an existing customer",
];

export default function SalesTrainingPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Sales Training</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Stop burning live leads<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">to train your reps.</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto mb-10 leading-relaxed">
            EXPRESSO AI gives your sales team unlimited practice reps against adaptive AI buyers — with real-time scoring on persuasion, objection handling, and value framing.
          </p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book a Sales Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Measurable Outcomes</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Training that shows up in the numbers.</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-6">Every high-stakes sales conversation, simulated.</h2>
            <p className="text-[#6e5646] leading-relaxed mb-8">
              Our AI buyers adapt to your rep's tone, confidence, and strategy in real time. No two sessions are identical.
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Ready to cut ramp time by 35%?</h2>
          <p className="text-[#6e5646] mb-8">Book a 30-minute pilot and we'll run your team through a live simulation tailored to your sales motion.</p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book Sales Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
