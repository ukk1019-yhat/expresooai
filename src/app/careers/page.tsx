import { Metadata } from "next";
import { ArrowRight, Zap, Globe, Brain, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | EXPRESSO AI",
  description: "Join EXPRESSO AI — we're building the operating system for human behavioral intelligence. See open roles and our team culture.",
};

const perks = [
  { icon: <Brain size={20} className="text-[#8b5a2b]" />, title: "Hard problems only", desc: "We're building infrastructure that doesn't exist yet. Every day involves novel technical and product challenges." },
  { icon: <Globe size={20} className="text-blue-500" />, title: "Remote-first", desc: "Work from anywhere. We care about output, not office hours." },
  { icon: <Zap size={20} className="text-amber-500" />, title: "Move fast", desc: "Small team, big scope. Your work ships and matters immediately." },
  { icon: <Heart size={20} className="text-rose-500" />, title: "Mission-driven", desc: "We believe human performance is the last great unmeasured frontier. That belief drives everything we build." },
];

const openRoles = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", type: "Full-time · Remote", desc: "Build the simulation engine, scoring infrastructure, and enterprise dashboard. Next.js, Python, LLM orchestration." },
  { title: "AI/ML Engineer — Behavioral Models", team: "AI Research", type: "Full-time · Remote", desc: "Design and train the behavioral adaptation models that power our real-time scoring engine." },
  { title: "Enterprise Account Executive", team: "Sales", type: "Full-time · Remote", desc: "Own the full enterprise sales cycle — from outbound to close. You'll be selling to L&D, HR, and Sales leaders." },
  { title: "Product Designer", team: "Design", type: "Full-time · Remote", desc: "Design the simulation interface, analytics dashboard, and enterprise admin console. High craft, high autonomy." },
];

export default function CareersPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Careers</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-8">
            Build the infrastructure<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">for human performance.</span>
          </h1>
          <p className="text-xl text-[#6e5646] max-w-2xl leading-relaxed">
            We&apos;re a small team working on a large problem. If you want to build something that genuinely matters — and hasn&apos;t been built before — we want to talk.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Why Join</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">What it&apos;s like to work here.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p, i) => (
              <div key={i} className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#d4c3ab] flex items-center justify-center mb-6">
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-[#2c1e16] mb-3">{p.title}</h3>
                <p className="text-sm text-[#6e5646] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Open Roles</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16]">We&apos;re hiring across the stack.</h2>
          </div>
          <div className="flex flex-col gap-4">
            {openRoles.map((role, i) => (
              <div key={i} className="bg-[#fdfbf7] border border-[#d4c3ab] rounded-2xl p-8 hover:border-[#c4b094] transition-all group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#2c1e16] mb-1">{role.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#8b5a2b] bg-[#f4ebd8] border border-[#d4c3ab] px-3 py-1 rounded-full">{role.team}</span>
                      <span className="text-xs text-[#826a57]">{role.type}</span>
                    </div>
                  </div>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#704823] hover:text-[#8b5a2b] transition-colors flex-shrink-0"
                  >
                    Apply <ArrowRight size={14} />
                  </a>
                </div>
                <p className="text-sm text-[#6e5646] leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Don&apos;t see your role?</h2>
          <p className="text-[#6e5646] mb-8">We&apos;re always interested in exceptional people. Send us a note and tell us what you&apos;d build.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Get in Touch <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
