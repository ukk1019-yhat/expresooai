"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-32 bg-zinc-950 relative border-t border-white/5 overflow-hidden" id="contact">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Train Human Performance <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">at Scale.</span>
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
            Stop relying on subjective feedback and static roleplay. Deploy adaptive behavioral intelligence to your entire organization today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#live-simulation" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20"
            >
              Start Simulation <ArrowRight size={18} />
            </Link>
            <a 
              href="https://calendly.com/ukkukk97/30min" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-zinc-800 transition-colors"
            >
              Contact Enterprise Team
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
