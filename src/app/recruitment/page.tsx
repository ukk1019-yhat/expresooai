import { Metadata } from "next";
import { ArrowRight, Clock, Users, Target, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Recruitment | EXPRESSO AI",
  description: "AI-powered candidate assessment — standardized behavioral interviews that save 20+ hours per hire and eliminate subjective bias.",
};

const outcomes = [
  { icon: <Clock size={20} className="text-emerald-500" />, stat: "20+", label: "Hours Saved / Hire", desc: "Automated first-round behavioral screening before any human interview time." },
  { icon: <Target size={20} className="text-[#8b5a2b]" />, stat: "Objective", label: "Scoring", desc: "Eliminate interviewer bias with consistent, data-driven behavioral scores." },
  { icon: <Users size={20} className="text-blue-500" />, stat: "Scalable", label: "At Any Volume", desc: "Screen 10 or 10,000 candidates with the same quality and consistency." },
  { icon: <CheckCircle size={20} className="text-violet-500" />, stat: "Custom", label: "Role Profiles", desc: "Define the behavioral benchmarks for each role and let the AI assess against them." },
];

export default function RecruitmentPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Recruitment & Assessment</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Know how candidates<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">actually communicate.</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto mb-10 leading-relaxed">
            Standardized AI behavioral interviews that assess communication skills, emotional intelligence, and role-fit — before a single human hour is spent.
          </p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book a Recruitment Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Why It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Hire for communication. Measure it objectively.</h2>
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

      {/* How it works for recruiting */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">The Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16]">From application to behavioral score in minutes.</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { step: "01", title: "Define the role profile", desc: "Set the behavioral benchmarks for the role — what does great communication look like for this position?" },
              { step: "02", title: "Candidate completes AI simulation", desc: "The candidate engages in a standardized roleplay scenario relevant to the role. No scheduling required." },
              { step: "03", title: "Receive behavioral scorecard", desc: "Get an objective breakdown of persuasion, clarity, emotional control, and role-specific dimensions." },
              { step: "04", title: "Human interview with context", desc: "Your team enters the final interview with data — knowing exactly where to probe and what to validate." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 p-6 bg-[#fdfbf7] border border-[#d4c3ab] rounded-2xl">
                <span className="text-3xl font-bold text-[#d4c3ab] flex-shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-[#2c1e16] mb-2">{item.title}</h3>
                  <p className="text-[#6e5646] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Save 20+ hours per hire.</h2>
          <p className="text-[#6e5646] mb-8">Book a pilot and we'll show you how behavioral assessment works for your specific roles and hiring volume.</p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book Recruitment Pilot <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
