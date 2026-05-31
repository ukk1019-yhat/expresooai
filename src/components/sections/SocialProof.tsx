"use client";

import { motion } from "framer-motion";
import { MessageSquare, BarChart2, RefreshCw } from "lucide-react";

const reasons = [
  {
    icon: <MessageSquare size={22} className="text-[#8b5a2b]" />,
    title: "Practice without consequences",
    description: "Your team can fail, recover, and try again in a simulation — without burning a real lead, upsetting a real customer, or damaging a real relationship.",
  },
  {
    icon: <BarChart2 size={22} className="text-blue-500" />,
    title: "Objective feedback, not opinions",
    description: "Every session is scored consistently. No more subjective manager feedback or inconsistent coaching. Everyone gets the same standard.",
  },
  {
    icon: <RefreshCw size={22} className="text-emerald-500" />,
    title: "Unlimited reps, zero scheduling",
    description: "Traditional roleplay requires a manager's time. AI simulations are available 24/7 — your team can practice as many times as they need.",
  },
];

export function SocialProof() {
  return (
    <section className="py-24 bg-[#fdfbf7] relative border-t border-[#e3d5c1]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Why It Works</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-[#2c1e16] max-w-2xl">
            The gap between training and performance is practice.
          </h3>
          <p className="text-[#6e5646] mt-4 max-w-xl">
            Most teams know what good communication looks like. They just don&apos;t get enough reps to make it automatic. BeyonAi fixes that.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fdfbf7] border border-[#d4c3ab] flex items-center justify-center mb-6">
                {r.icon}
              </div>
              <h4 className="text-lg font-bold text-[#2c1e16] mb-3">{r.title}</h4>
              <p className="text-sm text-[#6e5646] leading-relaxed">{r.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
