import { Metadata } from "next";
import { Architecture } from "@/components/sections/Architecture";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Architecture | EXPRESSO AI",
  description: "The technical architecture behind EXPRESSO AI — LLMs, behavioral adaptation models, real-time scoring, and enterprise-grade infrastructure.",
};

export default function ArchitecturePage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">Technical Architecture</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-6">
            Built for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">enterprise scale.</span>
          </h1>
          <p className="text-lg text-[#6e5646] max-w-2xl mx-auto leading-relaxed">
            A purpose-built stack combining LLMs, behavioral adaptation models, real-time signal processing, and enterprise-grade security — not a wrapper around a chatbot.
          </p>
        </div>
      </section>

      {/* Architecture diagram */}
      <Architecture />

      {/* Security & Compliance */}
      <section className="py-24 px-6 border-t border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Security & Compliance</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Enterprise-grade from day one.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "SOC2 Type II", desc: "Full compliance with enterprise security standards. Audit logs, access controls, and data isolation by default." },
              { title: "Data Isolation", desc: "Your simulation data is never used to train our base models. Each enterprise tenant is fully siloed." },
              { title: "Private Deployment", desc: "Deploy on your own infrastructure or a dedicated cloud environment for regulated industries." },
            ].map((item, i) => (
              <div key={i} className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-8">
                <div className="w-2 h-8 bg-[#8b5a2b] rounded-full mb-6" />
                <h3 className="text-xl font-bold text-[#2c1e16] mb-3">{item.title}</h3>
                <p className="text-[#6e5646] leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#e3d5c1] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Questions about the stack?</h2>
          <p className="text-[#6e5646] mb-8">Our engineering team is happy to walk through the architecture, security model, and integration options.</p>
          <a
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Talk to Engineering <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
