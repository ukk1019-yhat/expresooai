"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#fdfbf7]/60 backdrop-blur-md border-b border-[#e3d5c1] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-[#2c1e16]">
            EXPRESSO<span className="text-[#704823]">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#product" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
            Product
          </Link>
          <Link href="#use-cases" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
            Use Cases
          </Link>
          <Link href="#technology" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
            Technology
          </Link>
          <div className="flex items-center gap-4 ml-4">

            <a
              href="https://calendly.com/ukkukk97/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2c1e16] text-[#fdfbf7] px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              Book Pilot
            </a>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#6e5646] hover:text-[#2c1e16]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-[#fdfbf7] border-b border-[#d4c3ab] py-6 px-6 flex flex-col gap-4 md:hidden"
        >
          <Link href="#product" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>Product</Link>
          <Link href="#use-cases" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>Use Cases</Link>
          <Link href="#technology" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>Technology</Link>
          <hr className="border-[#d4c3ab] my-2" />

          <a href="https://calendly.com/ukkukk97/30min" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-4 py-2 rounded-lg text-center font-semibold mt-2" onClick={() => setMobileMenuOpen(false)}>Book Pilot</a>
        </motion.div>
      )}
    </header>
  );
}
