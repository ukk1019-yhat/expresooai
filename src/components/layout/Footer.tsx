import Link from "next/link";


export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl tracking-tight text-white">
                EXPRESSO<span className="text-orange-600">AI</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              The Operating System for Human Behavioral Intelligence. Measure, train, and scale communication performance across your enterprise.
            </p>
            <div className="flex items-center gap-4 text-zinc-500">
              <a href="https://x.com/expressooai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://www.linkedin.com/in/chokkapu-uma-krishna-kanth-50a502288/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#product" className="text-zinc-500 hover:text-white text-sm transition-colors">Platform</Link></li>
              <li><Link href="#live-simulation" className="text-zinc-500 hover:text-white text-sm transition-colors">Simulations</Link></li>
              <li><Link href="#analytics" className="text-zinc-500 hover:text-white text-sm transition-colors">Analytics</Link></li>
              <li><Link href="#architecture" className="text-zinc-500 hover:text-white text-sm transition-colors">Architecture API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Solutions</h4>
            <ul className="space-y-3">
              <li><Link href="#use-cases" className="text-zinc-500 hover:text-white text-sm transition-colors">Sales Training</Link></li>
              <li><Link href="#use-cases" className="text-zinc-500 hover:text-white text-sm transition-colors">Leadership Coaching</Link></li>
              <li><Link href="#use-cases" className="text-zinc-500 hover:text-white text-sm transition-colors">Recruitment</Link></li>
              <li><Link href="#use-cases" className="text-zinc-500 hover:text-white text-sm transition-colors">Customer Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-white text-sm transition-colors">Careers</Link></li>
              <li><Link href="#contact" className="text-zinc-500 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Expresso AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400">Privacy Policy</Link>
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400">Terms of Service</Link>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-zinc-400 font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
