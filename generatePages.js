const fs = require('fs');
const path = require('path');

const pages = [
  {
    path: 'src/app/platform',
    title: 'Platform',
    content: `
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";

export default function PlatformPage() {
  return (
    <div className="pt-20">
      <Hero />
      <HowItWorks />
    </div>
  );
}
`
  },
  {
    path: 'src/app/simulations',
    title: 'Simulations',
    content: `
import { SimulationDemo } from "@/components/sections/SimulationDemo";

export default function SimulationsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <SimulationDemo />
    </div>
  );
}
`
  },
  {
    path: 'src/app/analytics',
    title: 'Analytics',
    content: `
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <AnalyticsDashboard />
    </div>
  );
}
`
  },
  {
    path: 'src/app/architecture',
    title: 'Architecture API',
    content: `
import { Architecture } from "@/components/sections/Architecture";

export default function ArchitecturePage() {
  return (
    <div className="pt-20 min-h-screen">
      <Architecture />
    </div>
  );
}
`
  },
  {
    path: 'src/app/sales-training',
    title: 'Sales Training Solutions',
    desc: 'Empower your sales reps to handle complex pricing objections and navigate procurement teams safely.'
  },
  {
    path: 'src/app/leadership-coaching',
    title: 'Leadership Coaching',
    desc: 'Prepare executives for crisis communications, board meetings, and difficult performance reviews.'
  },
  {
    path: 'src/app/recruitment',
    title: 'Recruitment & Assessment',
    desc: 'Assess candidate communication skills through standardized AI roleplays before the final human interview.'
  },
  {
    path: 'src/app/customer-support',
    title: 'Customer Support Training',
    desc: 'Simulate irate customers and complex edge cases to build empathy and de-escalation skills safely.'
  },
  {
    path: 'src/app/about-us',
    title: 'About Expresso AI',
    desc: 'We are building the infrastructure for human behavioral intelligence.'
  },
  {
    path: 'src/app/careers',
    title: 'Careers at Expresso AI',
    desc: 'Join us in defining the future of enterprise communication training.'
  }
];

pages.forEach(p => {
  fs.mkdirSync(p.path, { recursive: true });
  const fileContent = p.content || `
export default function Page() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#d4c3ab] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#8b5a2b] animate-pulse" />
          <span className="text-xs font-medium text-[#5c4433] uppercase tracking-wider">Coming Soon</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#2c1e16] mb-6">${p.title}</h1>
        <p className="text-xl text-[#6e5646] mb-12">
          ${p.desc}
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
`;
  fs.writeFileSync(path.join(p.path, 'page.tsx'), fileContent.trim());
});

console.log('Pages generated successfully.');
