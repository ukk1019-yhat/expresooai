"use client";

import { motion } from "framer-motion";
import { Mic, Activity, CheckCircle2, PlayCircle, PauseCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function SimulationDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);

  const messages = [
    { type: "user", text: "We'd like you to consider a pilot program. Our platform handles this entire workflow natively." },
    { type: "ai", text: "A pilot is interesting, but your pricing is roughly 40% higher than the legacy vendor we currently use. How do you justify the premium?", emotion: "Skeptical", objection: "Pricing Challenge" },
    { type: "user", text: "The premium reflects the fact that we replace three separate tools. You're actually saving 15% overall when you factor in consolidation." },
    { type: "ai", text: "I see your point about consolidation. If we can verify that 15% savings during the pilot, we might have a path forward.", emotion: "Receptive", objection: "Resolved" },
  ];

  // Auto-play simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveMessage((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, messages.length]);

  return (
    <section className="py-32 bg-black relative" id="live-simulation">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Interactive Demo UI */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col"
        >
          {/* Header */}
          <div className="bg-zinc-900/80 px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-white tracking-wide">Live Simulation</span>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              {isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
              {isPlaying ? "Pause" : "Play Demo"}
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 space-y-6 bg-[#0a0a0a] min-h-[400px]">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: idx <= activeMessage ? 1 : 0.2, filter: idx <= activeMessage ? "blur(0px)" : "blur(4px)" }}
                className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.type === "user" 
                    ? "bg-orange-600 text-white rounded-br-sm" 
                    : "bg-zinc-900 border border-white/5 text-zinc-200 rounded-bl-sm"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                {msg.type === "ai" && idx <= activeMessage && (
                  <div className="flex items-center gap-3 mt-2 px-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">
                      Emotion: {msg.emotion}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                      State: {msg.objection}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-zinc-900/80 border-t border-white/5">
            <div className="bg-black border border-white/10 rounded-full px-4 py-3 flex items-center gap-3">
              <Mic size={18} className="text-orange-500" />
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                {isPlaying && <div className="h-full bg-orange-500 w-1/3 animate-[pulse_1s_ease-in-out_infinite]" />}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Copy & Context */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-sm font-semibold tracking-widest text-orange-500 uppercase mb-3">Adaptive Intelligence</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Experience hyper-realistic conversations.</h3>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Our Behavioral Engine doesn't just read scripts. It maintains complex emotional states, remembers conversational history, and dynamically shifts tactics based on your performance.
            </p>
          </div>

          <div className="space-y-4">
            <FeatureRow title="Dynamic Objections" description="AI throws curveballs based on your specific industry and product." />
            <FeatureRow title="Emotional Volatility" description="Personas get frustrated, receptive, or skeptical based on your tone." />
            <FeatureRow title="Real-Time Branching" description="Every word you say alters the trajectory of the simulation entirely." />
          </div>
        </div>

      </div>
    </section>
  );
}

function FeatureRow({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
        <CheckCircle2 size={14} />
      </div>
      <div>
        <h4 className="text-white font-medium text-base mb-1">{title}</h4>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
