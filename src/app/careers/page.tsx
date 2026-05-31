export default function Page() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#d4c3ab] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#8b5a2b] animate-pulse" />
          <span className="text-xs font-medium text-[#5c4433] uppercase tracking-wider">Coming Soon</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#2c1e16] mb-6">Careers at BeyonAi</h1>
        <p className="text-xl text-[#6e5646] mb-12">
          Join us in defining the future of enterprise communication training.
        </p>
        <a 
          href="https://calendly.com/ukkukk97/30min" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
        >
          Book Enterprise Pilot
        </a>
      </div>
    </div>
  );
}