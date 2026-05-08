"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export function FinalCTA() {
  return (
    <section className="py-32 bg-[#fdfbf7] relative border-t border-[#e3d5c1] overflow-hidden" id="contact">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#704823]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: headline + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:pt-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-[#2c1e16] mb-6 tracking-tight">
              Train Human Performance <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a67243] to-[#704823]">at Scale.</span>
            </h2>
            <p className="text-lg text-[#6e5646] mb-10 max-w-xl">
              Stop relying on subjective feedback and static roleplay. Deploy adaptive behavioral intelligence to your entire organization today.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="https://calendly.com/ukkukk97/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
              >
                Book a Pilot Call <ArrowRight size={18} />
              </a>
              <Link
                href="#live-simulation"
                className="inline-flex items-center gap-2 border border-[#c4b094] text-[#2c1e16] px-8 py-4 rounded-lg font-semibold hover:bg-[#e8decb] transition-colors"
              >
                Try Simulation
              </Link>
            </div>
          </motion.div>

          {/* Right: contact form connected to Google Sheets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl p-8"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-[#8b5a2b] uppercase mb-1">Get in Touch</p>
              <h3 className="text-xl font-bold text-[#2c1e16]">Send us a message</h3>
              <p className="text-sm text-[#6e5646] mt-1">We respond to every inquiry within 24 hours.</p>
            </div>
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
