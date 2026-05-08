import { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";
import { ArrowRight, TrendingUp, Users, Target, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics | EXPRESSO AI",
  description: "Enterprise behavioral analytics — track, benchmark, and improve communication performance across your entire workforce.",
};

const metrics = [
  { icon: <TrendingUp size={20} className="text-emerald-500" />, label: "Avg. Improvement", value: "+34%", sub: "after 10 sessions" },
  { icon: <Users size={20} className="text-blue-500" />, label: "Team Benchmarking", value: "Org-wide", sub: "across all roles" },
  { icon: <Target size={20} className="text-[#8b5a2b]" />, label: "Dimensions Tracked", value: "500+", sub: "per session" },
  { icon: <BarChart2 size={20} className="text-violet-500" />, label: "Data Retention", value: "Full history", sub: "with trend analysis" },
];

export default function AnalyticsPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Behavioral Analytics</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Finally, data on<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">human performance.</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto leading-relaxed">
            Track persuasion, clarity, emotional control, and 500+ behavioral dimensions across every employee — with org-wide benchmarks and trend analysis.
          </p>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-16 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="text-center p-6 bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl">
              <div className="flex justify-center mb-3">{m.icon}</div>
              <div className="text-2xl font-bold text-[#2c1e16] mb-1">{m.value}</div>
              <div className="text-xs font-semibold text-[#8b5a2b] uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-xs text-[#826a57]">{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard component */}
      <AnalyticsDashboard />

      {/* What you can measure */}
      <section className="py-24 px-6 border-t border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">What Gets Measured</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Answer the questions you couldn't before.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Who negotiates best under pressure?", a: "Rank your team by persuasion score, objection handling, and emotional stability across simulations." },
              { q: "Where is the skill gap in my sales org?", a: "Identify which dimensions — clarity, confidence, value framing — are dragging down close rates." },
              { q: "Is our training actually working?", a: "Track score trajectories over time. See exactly which sessions drove improvement and which didn't." },
            ].map((item, i) => (
              <div key={i} className="bg-[#fdfbf7] border border-[#d4c3ab] rounded-2xl p-8">
                <h3 className="text-lg font-bold text-[#2c1e16] mb-3">{item.q}</h3>
                <p className="text-[#6e5646] leading-relaxed text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#e3d5c1] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">See your team's behavioral data.</h2>
          <p className="text-[#6e5646] mb-8">Book a pilot and we'll run your team through a simulation and show you the analytics dashboard live.</p>
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
