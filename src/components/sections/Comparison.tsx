"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

export function Comparison() {
  const features = [
    { name: "Adaptive Roleplay", trad: false, genAi: false, expresso: true },
    { name: "Behavioral Scoring Engine", trad: false, genAi: false, expresso: true },
    { name: "Enterprise Analytics", trad: false, genAi: false, expresso: true },
    { name: "Scalable Training", trad: false, genAi: true, expresso: true },
    { name: "Real-Time Feedback", trad: "Partial", genAi: true, expresso: true },
    { name: "Cost Profile", trad: "High", genAi: "Low", expresso: "High ROI" }
  ];

  const renderIcon = (val: boolean | string) => {
    if (val === true) return <Check size={20} className="text-emerald-500 mx-auto" />;
    if (val === false) return <X size={20} className="text-zinc-700 mx-auto" />;
    if (val === "Partial") return <Minus size={20} className="text-amber-500 mx-auto" />;
    return <span className="text-sm font-medium text-zinc-300">{val}</span>;
  };

  return (
    <section className="py-32 bg-black relative border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-orange-500 uppercase mb-3">The Advantage</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white">Why Expresso AI</h3>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Static training is obsolete. Generic chatbots lack behavioral context. We built the infrastructure specifically for human performance.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-4 border-b border-white/10 bg-black/50">
            <div className="p-6 flex items-end">
              <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Capability</span>
            </div>
            <div className="p-6 text-center border-l border-white/5">
              <h4 className="text-white font-semibold">Traditional Training</h4>
              <p className="text-xs text-zinc-500 mt-1">LMS & Workshops</p>
            </div>
            <div className="p-6 text-center border-l border-white/5">
              <h4 className="text-white font-semibold">Generic AI</h4>
              <p className="text-xs text-zinc-500 mt-1">Standard Chatbots</p>
            </div>
            <div className="p-6 text-center border-l border-orange-500/30 bg-orange-500/5 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
              <h4 className="text-orange-500 font-bold">EXPRESSO AI</h4>
              <p className="text-xs text-orange-500/70 mt-1">Behavioral Platform</p>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {features.map((feat, idx) => (
              <div key={idx} className="grid grid-cols-4 hover:bg-white/[0.02] transition-colors">
                <div className="p-5 flex items-center">
                  <span className="text-sm font-medium text-white">{feat.name}</span>
                </div>
                <div className="p-5 border-l border-white/5 flex items-center justify-center">
                  {renderIcon(feat.trad)}
                </div>
                <div className="p-5 border-l border-white/5 flex items-center justify-center">
                  {renderIcon(feat.genAi)}
                </div>
                <div className="p-5 border-l border-orange-500/20 bg-orange-500/[0.02] flex items-center justify-center">
                  {renderIcon(feat.expresso)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
