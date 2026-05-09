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
    <section className="py-32 bg-[#fdfbf7] relative" id="live-simulation">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left: Interactive Demo UI */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl overflow-hidden border border-[#d4c3ab] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#f4ebd8]/80 px-6 py-4 border-b border-[#e3d5c1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-[#2c1e16] tracking-wide">Live Simulation</span>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-[#6e5646] hover:text-[#2c1e16] transition-colors flex items-center gap-2 text-sm"
            >
              {isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
              {isPlaying ? "Pause" : "Play Demo"}
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 space-y-6 bg-[#fdfbf7] min-h-[400px]">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: idx <= activeMessage ? 1 : 0.2, filter: idx <= activeMessage ? "blur(0px)" : "blur(4px)" }}
                className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.type === "user" 
                    ? "bg-[#704823] text-white rounded-br-sm" 
                    : "bg-[#f4ebd8] border border-[#e3d5c1] text-[#3b2b20] rounded-bl-sm"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                {msg.type === "ai" && idx <= activeMessage && (
                  <div className="flex items-center gap-3 mt-2 px-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8b5a2b]">
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
          <div className="p-4 bg-[#f4ebd8]/80 border-t border-[#e3d5c1]">
            <div className="bg-[#fdfbf7] border border-[#d4c3ab] rounded-full px-4 py-3 flex items-center gap-3">
              <Mic size={18} className="text-[#8b5a2b]" />
              <div className="flex-1 h-2 bg-[#e8decb] rounded-full overflow-hidden">
                {isPlaying && <div className="h-full bg-[#8b5a2b] w-1/3 animate-[pulse_1s_ease-in-out_infinite]" />}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Copy & Context */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-sm font-semibold tracking-widest text-[#8b5a2b] uppercase mb-3">Interactive Demo</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-[#2c1e16] mb-6">See a live AI roleplay simulation.</h3>
            <p className="text-lg text-[#6e5646] leading-relaxed">
              The AI buyer reacts to your tone, word choice, and confidence in real time — not a script. Every session is different.
            </p>
          </div>

          <div className="space-y-4">
            <FeatureRow title="Realistic Objections" description="AI throws the exact objections your team faces — pricing, competition, timing." />
            <FeatureRow title="Adaptive Tone" description="Personas shift from skeptical to receptive based on how well you respond." />
            <FeatureRow title="Instant Scoring" description="Every response is scored live so you know exactly where you improved." />
          </div>
        </div>

      </div>
    </section>
  );
}

function FeatureRow({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#8b5a2b]/10 border border-[#8b5a2b]/20 flex items-center justify-center text-[#8b5a2b]">
        <CheckCircle2 size={14} />
      </div>
      <div>
        <h4 className="text-[#2c1e16] font-medium text-base mb-1">{title}</h4>
        <p className="text-sm text-[#6e5646]">{description}</p>
      </div>
    </div>
  );
}
