"use client";

import { motion } from "framer-motion";
import { Database, Cpu, Network, Zap, Lock, Shield } from "lucide-react";

export function Architecture() {
  const layers = [
    { name: "Simulation Orchestration", icon: <Network size={16} />, desc: "Manages state and context injection." },
    { name: "Adaptive Memory Layer", icon: <Database size={16} />, desc: "RAG-based conversational history." },
    { name: "Behavioral Engine", icon: <Cpu size={16} />, desc: "LLM fine-tuned for psychological realism." },
    { name: "Conversation Intelligence", icon: <Zap size={16} />, desc: "Sub-200ms latency voice processing." },
    { name: "Real-Time Feedback System", icon: <Shield size={16} />, desc: "Live multi-dimensional scoring." },
    { name: "Enterprise Analytics Engine", icon: <Lock size={16} />, desc: "Data aggregation and SOC2 compliance." }
  ];

  return (
    <section className="py-32 bg-zinc-950 relative border-t border-white/5 overflow-hidden" id="architecture">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Diagram */}
        <div className="relative z-10 flex flex-col gap-4">
          {layers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card p-4 flex items-center gap-4 bg-zinc-900/80 hover:bg-zinc-800 transition-colors cursor-default border border-white/10 group z-10 relative">
                <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  {layer.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm tracking-wide">{layer.name}</h4>
                  <p className="text-xs text-zinc-500">{layer.desc}</p>
                </div>
              </div>
              
              {/* Connecting lines between nodes */}
              {index !== layers.length - 1 && (
                <div className="absolute left-9 top-14 w-[1px] h-4 bg-orange-500/30 z-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Right: Copy */}
        <div className="relative z-10">
          <h2 className="text-sm font-semibold tracking-widest text-orange-500 uppercase mb-3">Technical Architecture</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for scale, speed, and security.</h3>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8">
            Our platform isn't a wrapper. We engineered a proprietary stack that decouples conversational generation from behavioral analysis, ensuring sub-second latency while processing 500+ data points per utterance.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
            <div>
              <h5 className="text-3xl font-bold text-white mb-1">&lt;200<span className="text-lg text-orange-500">ms</span></h5>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Voice Latency</p>
            </div>
            <div>
              <h5 className="text-3xl font-bold text-white mb-1">SOC 2</h5>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Type II Certified</p>
            </div>
            <div>
              <h5 className="text-3xl font-bold text-white mb-1">99.99<span className="text-lg text-orange-500">%</span></h5>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Uptime SLA</p>
            </div>
            <div>
              <h5 className="text-3xl font-bold text-white mb-1">RAG</h5>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Enterprise Context</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
