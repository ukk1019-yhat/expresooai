"use client";

import { motion } from "framer-motion";
import { Briefcase, LineChart, Users, Headset, Handshake, Brain } from "lucide-react";

export function UseCases() {
  const cases = [
    {
      title: "Sales Training",
      description: "Train reps to handle complex pricing objections and navigate procurement teams without burning live leads.",
      roi: "35% Faster Ramp Time",
      icon: <LineChart size={24} className="text-orange-500" />
    },
    {
      title: "Leadership Coaching",
      description: "Prepare executives for crisis communications, board meetings, and difficult performance reviews.",
      roi: "40% Higher Confidence Scores",
      icon: <Briefcase size={24} className="text-emerald-500" />
    },
    {
      title: "Hiring & Recruitment",
      description: "Assess candidate communication skills through standardized AI roleplays before the final human interview.",
      roi: "Save 20+ Hours/Hire",
      icon: <Users size={24} className="text-blue-500" />
    },
    {
      title: "Customer Support",
      description: "Simulate irate customers and complex edge cases to build empathy and de-escalation skills safely.",
      roi: "50% Drop in Escalations",
      icon: <Headset size={24} className="text-violet-500" />
    },
    {
      title: "Negotiation Practice",
      description: "Enterprise-grade procurement simulations that force teams to defend value and maintain margins.",
      roi: "15% Margin Preservation",
      icon: <Handshake size={24} className="text-rose-500" />
    },
    {
      title: "Communication Intelligence",
      description: "Org-wide benchmarking of clarity, persuasion, and emotional control across thousands of employees.",
      roi: "Enterprise Deployment",
      icon: <Brain size={24} className="text-amber-500" />
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] relative border-t border-white/5" id="use-cases">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-semibold tracking-widest text-orange-500 uppercase mb-3">Enterprise Scale</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">Built for the most critical human workflows.</h3>
          </div>
          <p className="text-zinc-400 max-w-md">
            EXPRESSO AI provides role-specific behavioral infrastructure designed to deliver immediate, measurable business impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-black border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />
              
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6">
                {useCase.icon}
              </div>
              
              <h4 className="text-xl font-bold text-white mb-3">{useCase.title}</h4>
              <p className="text-sm text-zinc-400 leading-relaxed mb-8 min-h-[60px]">
                {useCase.description}
              </p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 mt-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{useCase.roi}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
