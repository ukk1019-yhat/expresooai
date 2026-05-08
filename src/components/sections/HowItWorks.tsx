"use client";

import { motion } from "framer-motion";
import { ListVideo, UserCircle2, ActivitySquare, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Choose a Scenario",
      description: "Select from Sales Call, Investor Pitch, Negotiation, Hiring Interview, or Customer Support.",
      icon: <ListVideo size={24} />,
    },
    {
      id: "02",
      title: "Dynamic Simulation",
      description: "AI dynamically simulates human behavior, injecting realistic objections and emotional shifts.",
      icon: <UserCircle2 size={24} />,
    },
    {
      id: "03",
      title: "Real-Time Analysis",
      description: "The conversation is analyzed live across 500+ behavioral dimensions and communication metrics.",
      icon: <ActivitySquare size={24} />,
    },
    {
      id: "04",
      title: "Feedback & Analytics",
      description: "Receive deep scoring, analytics, and actionable improvement suggestions instantly post-session.",
      icon: <TrendingUp size={24} />,
    },
  ];

  return (
    <section className="py-24 bg-[#fdfbf7] relative border-t border-[#e3d5c1]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Workflow</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[#2c1e16]">How the Platform Works</h3>
          <p className="text-[#6e5646] mt-4 max-w-2xl mx-auto">
            A seamless, adaptive pipeline from scenario selection to deep behavioral analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 bg-[#f4ebd8] border border-[#e3d5c1] rounded-2xl p-6 hover:border-[#8b5a2b]/30 hover:bg-[#e8decb]/80 transition-all group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#d4c3ab] flex items-center justify-center text-[#6e5646] group-hover:text-[#8b5a2b] group-hover:border-[#8b5a2b]/50 transition-colors">
                  {step.icon}
                </div>
                <span className="text-4xl font-bold text-[#2c1e16]/5 group-hover:text-[#2c1e16]/10 transition-colors">
                  {step.id}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-[#2c1e16] mb-2">{step.title}</h4>
              <p className="text-sm text-[#6e5646] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
