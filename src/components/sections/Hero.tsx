"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Target, ShieldCheck, MessageSquare } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-10 sm:pb-32 overflow-x-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] bg-[#704823]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center z-10">

        {/* Left: Copy — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-5 sm:gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#d4c3ab] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#8b5a2b] animate-pulse" />
            <span className="text-xs font-medium text-[#5c4433] uppercase tracking-wider">AI Roleplay Simulations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#2c1e16] leading-[1.15]">
            Train Teams for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">
              High-Stakes Conversations
            </span>{" "}
            Using AI Simulations
          </h1>

          <p className="text-base sm:text-lg text-[#6e5646] max-w-xl leading-relaxed">
            BeyonAi creates realistic AI roleplay environments that help sales, support, and leadership teams improve communication performance at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <Link
              href="#live-simulation"
              className="inline-flex items-center justify-center gap-2 bg-[#704823] text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20 w-full sm:w-auto"
            >
              Try AI Roleplay <ArrowRight size={18} />
            </Link>
            <a
              href="https://calendly.com/ukkukk97/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#c4b094] text-[#2c1e16] px-6 py-3.5 rounded-lg font-semibold hover:bg-[#e8decb] transition-colors w-full sm:w-auto"
            >
              Book Demo
            </a>
          </div>

          {/* What it scores */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-[#e3d5c1] mt-1">
            <div className="flex items-center gap-2 text-sm text-[#6e5646]">
              <span className="w-2 h-2 rounded-full bg-[#8b5a2b] flex-shrink-0" /> Persuasion
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6e5646]">
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" /> Clarity
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6e5646]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" /> Objection Handling
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6e5646]">
              <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" /> Confidence
            </div>
          </div>
        </motion.div>

        {/* Right: Simulation preview — hidden on mobile, visible on lg+ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="glass-card p-6 relative z-10 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4c3ab]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f4ebd8] border border-[#d4c3ab] flex items-center justify-center">
                  <MessageSquare size={18} className="text-[#8b5a2b]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2c1e16]">Sales Call Simulation</h3>
                  <p className="text-xs text-[#6e5646]">Pricing Objection · Round 2</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-semibold">
                Live
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-[#f4ebd8] p-4 rounded-lg border border-[#e3d5c1]">
                <p className="text-xs text-[#826a57] mb-2 font-semibold uppercase tracking-wide">AI Buyer</p>
                <p className="text-sm text-[#5c4433]">"Your competitors are offering the same at 30% less. Why should we pay a premium?"</p>
              </div>
              <div className="bg-[#8b5a2b]/10 p-4 rounded-lg border border-[#8b5a2b]/20 ml-4 relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#8b5a2b] rounded-full" />
                <p className="text-xs text-[#8b5a2b] mb-2 font-semibold uppercase tracking-wide">Your Response</p>
                <p className="text-sm text-[#2c1e16]">"That&apos;s fair. We replace three tools — your total cost is actually 15% lower when you factor in consolidation."</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard icon={<Target size={13} />} title="Persuasion" value={84} trend="+2.4" />
              <MetricCard icon={<Activity size={13} />} title="Clarity" value={89} trend="+3.0" />
              <MetricCard icon={<MessageSquare size={13} />} title="Objection Handling" value={78} trend="+1.8" />
              <MetricCard icon={<ShieldCheck size={13} />} title="Confidence" value={91} trend="+4.2" />
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#704823]/20 rounded-full blur-3xl z-0" />
        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({ icon, title, value, trend }: { icon: React.ReactNode; title: string; value: number; trend: string }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="bg-[#f4ebd8]/50 p-3 rounded-lg border border-[#e3d5c1]">
      <div className="flex items-center gap-1.5 text-[#6e5646] mb-2">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-[#2c1e16]">{value}<span className="text-xs text-[#826a57] font-normal">/100</span></span>
        <span className={`text-xs font-semibold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>{trend}</span>
      </div>
      <div className="w-full h-1 bg-[#e3d5c1] mt-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${value > 80 ? "bg-emerald-500" : "bg-[#8b5a2b]"}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
