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
    return <span className="text-sm font-medium text-[#5c4433]">{val}</span>;
  };

  return (
    <section className="py-32 bg-[#fdfbf7] relative border-t border-[#e3d5c1]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Why BeyonAi</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[#2c1e16]">Static training doesn&apos;t change behavior.</h3>
          <p className="text-[#6e5646] mt-4 max-w-2xl mx-auto">
            Watching videos and clicking through slides doesn&apos;t prepare your team for a real objection. Adaptive AI roleplay does.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#f4ebd8]/50 border border-[#d4c3ab] rounded-2xl overflow-hidden"
        >
          {/* Mobile: stacked cards */}
          <div className="block sm:hidden divide-y divide-[#d4c3ab]">
            {features.map((feat, idx) => (
              <div key={idx} className="p-4">
                <div className="font-semibold text-[#2c1e16] text-sm mb-3">{feat.name}</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#fdfbf7] rounded-lg p-2">
                    <div className="text-[#826a57] mb-1">Traditional</div>
                    <div>{renderIcon(feat.trad)}</div>
                  </div>
                  <div className="bg-[#fdfbf7] rounded-lg p-2">
                    <div className="text-[#826a57] mb-1">Generic AI</div>
                    <div>{renderIcon(feat.genAi)}</div>
                  </div>
                  <div className="bg-[#8b5a2b]/5 border border-[#8b5a2b]/20 rounded-lg p-2">
                    <div className="text-[#8b5a2b] font-bold mb-1">BeyonAi</div>
                    <div>{renderIcon(feat.expresso)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-4 border-b border-[#d4c3ab] bg-[#fdfbf7]/50">
              <div className="p-6 flex items-end">
                <span className="text-sm font-semibold text-[#826a57] uppercase tracking-wider">Capability</span>
              </div>
              <div className="p-6 text-center border-l border-[#e3d5c1]">
                <h4 className="text-[#2c1e16] font-semibold">Traditional Training</h4>
                <p className="text-xs text-[#826a57] mt-1">LMS &amp; Workshops</p>
              </div>
              <div className="p-6 text-center border-l border-[#e3d5c1]">
                <h4 className="text-[#2c1e16] font-semibold">Generic AI</h4>
                <p className="text-xs text-[#826a57] mt-1">Standard Chatbots</p>
              </div>
              <div className="p-6 text-center border-l border-[#8b5a2b]/30 bg-[#8b5a2b]/5 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#8b5a2b]" />
                <h4 className="text-[#8b5a2b] font-bold">BeyonAi</h4>
                <p className="text-xs text-[#8b5a2b]/70 mt-1">Behavioral Platform</p>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {features.map((feat, idx) => (
                <div key={idx} className="grid grid-cols-4 hover:bg-white/[0.02] transition-colors">
                  <div className="p-5 flex items-center">
                    <span className="text-sm font-medium text-[#2c1e16]">{feat.name}</span>
                  </div>
                  <div className="p-5 border-l border-[#e3d5c1] flex items-center justify-center">
                    {renderIcon(feat.trad)}
                  </div>
                  <div className="p-5 border-l border-[#e3d5c1] flex items-center justify-center">
                    {renderIcon(feat.genAi)}
                  </div>
                  <div className="p-5 border-l border-[#8b5a2b]/20 bg-[#8b5a2b]/[0.02] flex items-center justify-center">
                    {renderIcon(feat.expresso)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
