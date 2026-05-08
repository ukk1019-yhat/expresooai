"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, BrainCircuit, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10">
        
        {/* Left Column: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Enterprise Behavioral Intelligence</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            AI Training for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              High-Stakes
            </span>
            <br /> Human Conversations
          </h1>
          
          <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
            Practice negotiations, sales calls, leadership discussions, interviews, and customer interactions using adaptive AI simulations with real-time behavioral feedback.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link 
              href="#live-simulation" 
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
            >
              Try Live Simulation <ArrowRight size={18} />
            </Link>
            <Link 
              href="#contact" 
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-white/5 transition-colors"
            >
              Book Enterprise Pilot
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Interactive UI Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Glass Panel */}
          <div className="glass-card p-6 relative z-10 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                  <BrainCircuit size={20} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Simulation Session</h3>
                  <p className="text-xs text-zinc-400">Enterprise Deal · Round 3</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-semibold">
                Live Analysis
              </div>
            </div>

            {/* Conversation Snippet */}
            <div className="space-y-4 mb-8">
              <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-semibold">AI Buyer Persona</p>
                <p className="text-sm text-zinc-300">"Your competitors are offering the same platform at 30% less. Why should we pay a premium for your solution?"</p>
              </div>
              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20 ml-8 relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-full" />
                <p className="text-xs text-orange-500 mb-2 uppercase tracking-wide font-semibold">Your Response</p>
                <p className="text-sm text-white">"That's a fair question. The difference is in what you're not seeing—our infrastructure reduces ramp time by 60%, meaning ROI in week one."</p>
              </div>
            </div>

            {/* Metrics Dashboard Preview */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard icon={<Target size={14} />} title="Persuasion" value={84} trend="+2.4" />
              <MetricCard icon={<Activity size={14} />} title="Emotional Intel" value={92} trend="+5.1" />
              <MetricCard icon={<BrainCircuit size={14} />} title="Adaptability" value={78} trend="-1.2" />
              <MetricCard icon={<ShieldCheck size={14} />} title="Clarity" value={89} trend="+3.0" />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl z-0" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl z-0" />
        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: number, trend: string }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5">
      <div className="flex items-center gap-2 text-zinc-400 mb-3">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}<span className="text-sm text-zinc-500 font-normal">/100</span></span>
        <span className={`text-xs font-semibold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>{trend}</span>
      </div>
      <div className="w-full h-1 bg-white/5 mt-3 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${value > 80 ? "bg-emerald-500" : "bg-orange-500"}`} 
        />
      </div>
    </div>
  );
}
