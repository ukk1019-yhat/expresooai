import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | EXPRESSO AI",
  description: "EXPRESSO AI is building the operating system for human behavioral intelligence — the infrastructure layer for measuring and training communication performance.",
};

const values = [
  {
    title: "Measure what matters.",
    description: "Technical skills are commoditized. Human performance — negotiation, leadership, communication — is the last frontier of unmeasured enterprise value. We're building the infrastructure to change that.",
  },
  {
    title: "Honest over comfortable.",
    description: "Subjective feedback feels kind but doesn't drive improvement. We believe in objective, data-driven coaching that tells people exactly where they stand and how to get better.",
  },
  {
    title: "Infrastructure, not features.",
    description: "We're not building a training app. We're building the behavioral intelligence layer that enterprises will embed into every workflow — hiring, coaching, performance management.",
  },
  {
    title: "Compounding data advantage.",
    description: "Every simulation makes our models better. Every enterprise deployment generates proprietary behavioral data. The moat compounds with every session.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden border-b border-[#e3d5c1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#704823]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">About Us</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2c1e16] leading-tight mb-8">
            We&apos;re building the OS for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">human performance.</span>
          </h1>
          <p className="text-xl text-[#6e5646] max-w-2xl leading-relaxed">
            EXPRESSO AI is the infrastructure layer for behavioral intelligence — the system that finally makes human communication performance measurable, trainable, and scalable across the enterprise.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">The Problem We&apos;re Solving</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-6">$370B spent on training. 70% produces no measurable change.</h2>
            <p className="text-[#6e5646] leading-relaxed mb-6">
              As AI automates technical work, human value concentrates in communication, negotiation, and leadership. Yet no scalable system exists to measure or train these skills objectively.
            </p>
            <p className="text-[#6e5646] leading-relaxed">
              We&apos;re changing that. EXPRESSO AI is the first platform to combine adaptive AI simulation with real-time behavioral scoring — turning every conversation into a data point and every practice session into measurable improvement.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "$370B", label: "Annual corporate training spend" },
              { num: "70%", label: "Produces no measurable behavior change" },
              { num: "85%", label: "Of job success comes from soft skills" },
              { num: "0", label: "Scalable systems to measure them — until now" },
            ].map((item, i) => (
              <div key={i} className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#2c1e16] mb-2">{item.num}</div>
                <div className="text-xs text-[#6e5646] leading-relaxed">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">What We Believe</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16]">Principles that drive the product.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-[#fdfbf7] border border-[#d4c3ab] rounded-2xl p-8 border-l-4 border-l-[#8b5a2b]">
                <h3 className="text-xl font-bold text-[#2c1e16] mb-3">{v.title}</h3>
                <p className="text-[#6e5646] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 px-6 border-b border-[#e3d5c1]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-4">The Long-Term Vision</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#2c1e16] mb-8">
            The Salesforce of human performance.
          </h2>
          <p className="text-lg text-[#6e5646] leading-relaxed max-w-3xl mx-auto">
            Just as Salesforce became the infrastructure for CRM and Workday for HR, EXPRESSO AI is building the foundational layer for behavioral intelligence — deeply embedded in enterprise workflows, data-rich, and irreplaceable. The goal is to power behavioral evaluation across every enterprise, government, school, and hiring platform globally.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2c1e16] mb-4">Want to be part of it?</h2>
          <p className="text-[#6e5646] mb-8">We&apos;re looking for early enterprise partners and team members who believe human performance is the next frontier.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/ukkukk97/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
            >
              Book a Pilot Call <ArrowRight size={18} />
            </a>
            <a
              href="/careers"
              className="inline-flex items-center gap-2 border border-[#c4b094] text-[#2c1e16] px-8 py-4 rounded-lg font-semibold hover:bg-[#e8decb] transition-colors"
            >
              View Open Roles
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
