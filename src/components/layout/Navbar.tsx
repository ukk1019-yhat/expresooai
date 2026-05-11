"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
          <Link href="/#product" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
            Product
          </Link>
          <Link href="/#use-cases" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
            Use Cases
          </Link>
          <Link href="/faq" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
            FAQ
          </Link>

          <div className="flex items-center gap-3 ml-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/simulate"
                  className="bg-[#704823] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#8b5a2b] transition-colors"
                >
                  Start Simulation
                </Link>
                <Link href="/ai-tools" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
                  AI Tools
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-[#6e5646] hover:text-[#2c1e16] transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-[#2c1e16] text-[#fdfbf7] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#704823] transition-colors"
                >
                  Get Started Free
                </Link>
              </>
            )}
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
        <div className="absolute top-full left-0 right-0 bg-[#fdfbf7] border-b border-[#d4c3ab] py-6 px-6 flex flex-col gap-4 md:hidden">
          <Link href="/#product" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>Product</Link>
          <Link href="/#use-cases" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>Use Cases</Link>
          <Link href="/faq" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
          <hr className="border-[#d4c3ab] my-2" />
          {isSignedIn ? (
            <>
              <Link href="/simulate" className="bg-[#704823] text-white px-4 py-2 rounded-lg text-center font-semibold" onClick={() => setMobileMenuOpen(false)}>Start Simulation</Link>
              <Link href="/ai-tools" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>AI Tools</Link>
              <Link href="/dashboard" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <div className="flex items-center gap-3 pt-2">
                <UserButton />
                <span className="text-sm text-[#6e5646]">Account</span>
              </div>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-[#6e5646] hover:text-[#2c1e16]" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link href="/sign-up" className="bg-[#2c1e16] text-white px-4 py-2 rounded-lg text-center font-semibold" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
