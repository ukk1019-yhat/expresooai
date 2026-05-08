"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function SocialProof() {
  return (
    <section className="py-24 bg-black relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-orange-500 uppercase mb-3">Trusted by Innovators</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white">Powering the next generation of enterprise communication.</h3>
        </div>

        {/* Enterprise Logos Mockup */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 mb-24 grayscale">
          {["Acme Corp", "GlobalTech", "Quantum", "Nexus", "Vertex"].map((logo, i) => (
            <span key={i} className="text-2xl font-bold text-white tracking-tighter">{logo}</span>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <Metric title="Simulations Completed" value="50K+" />
          <Metric title="Training Completion Rate" value="92%" />
          <Metric title="Faster Skill Improvement" value="35%" />
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestimonialCard 
            quote="EXPRESSO AI completely transformed our sales enablement. Reps are practicing against the hardest objections before they ever get on a live call with a prospect."
            author="Sarah J., VP of Sales"
            company="Enterprise SaaS Co."
          />
          <TestimonialCard 
            quote="The behavioral analytics give us unprecedented visibility into our team's communication gaps. It's not just practice; it's measurable intelligence."
            author="Michael T., Chief People Officer"
            company="Global Finance Corp"
          />
        </div>
      </div>
    </section>
  );
}

function Metric({ title, value }: { title: string, value: string }) {
  return (
    <div className="text-center p-6 border border-white/5 rounded-2xl bg-zinc-900/30">
      <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">{value}</h4>
      <p className="text-sm text-zinc-400 font-medium">{title}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, company }: { quote: string, author: string, company: string }) {
  return (
    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 relative">
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="text-orange-500 fill-orange-500" />)}
      </div>
      <p className="text-lg text-zinc-300 leading-relaxed mb-8">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10" />
        <div>
          <h5 className="text-white font-semibold text-sm">{author}</h5>
          <p className="text-xs text-zinc-500">{company}</p>
        </div>
      </div>
    </div>
  );
}
