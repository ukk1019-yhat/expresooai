import { Metadata } from "next";
import { ArrowRight, Briefcase, Shield, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Leadership Coaching | EXPRESSO AI",
  description: "AI-powered leadership coaching — practice crisis communications, board presentations, and difficult performance reviews with adaptive AI simulations.",
};

const outcomes = [
  { icon: <TrendingUp size={20} className="text-emerald-500" />, stat: "40%", label: "Higher Confidence", desc: "Executives report significantly higher confidence after structured simulation practice." },
  { icon: <Shield size={20} className="text-[#8b5a2b]" />, stat: "Safe", label: "Practice Environment", desc: "Fail safely in a simulation before a real board meeting or crisis briefing." },
  { icon: <Users size={20} className="text-blue-500" />, stat: "Scalable", label: "Across All Levels", desc: "From frontline managers to C-suite — consistent, objective coaching at scale." },
  { icon: <Briefcase size={20} className="text-violet-500" />, stat: "Custom", label: "Scenarios", desc: "Build simulations from your actual org structure, culture, and leadership challenges." },
];

const scenarios = [
  "Crisis communication briefing to a board of directors",
  "Difficult performance review with a high-potential but disengaged employee",
  "Announcing a major restructuring to a skeptical leadership team",
  "Navigating a conflict between two senior direct reports",
  "Presenting a failed initiative and recovery plan to investors",
  "Managing a media inquiry during a product incident",
];

export default function LeadershipCoachingPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Leadership Coaching</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Practice the conversations<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">leaders dread most.</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto mb-10 leading-relaxed">
            Crisis briefings, board presentations, difficult reviews — EXPRESSO AI gives leaders a safe environment to practice high-stakes communication before it counts.
          </p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book a Leadership Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Why It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Leadership is a skill. Train it like one.</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-6">The hardest leadership moments, simulated.</h2>
            <p className="text-[#6e5646] leading-relaxed mb-8">
              AI personas that push back, escalate, and challenge your authority — so you're prepared when it matters.
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Prepare your leaders before it counts.</h2>
          <p className="text-[#6e5646] mb-8">Book a pilot and we'll design a simulation around your organization's most critical leadership challenges.</p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book Leadership Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
