import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Monitor, FileSearch, MessageSquare, ArrowRight, Crown } from "lucide-react";

const tools = [
  {
    href: "/ai-coach",
    icon: Monitor,
    accent: "#c47d3b",
    badge: "15 min free",
    badgeColor: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    title: "AI Marketing Coach",
    description:
      "Share your screen and get real-time guidance on ads, email campaigns, social content, landing pages, and analytics — as you work.",
    features: ["Live screen analysis", "Step-by-step guidance", "Any marketing tool"],
    cta: "Start Coaching Session",
  },
  {
    href: "/document-analysis",
    icon: FileSearch,
    accent: "#6366f1",
    badge: "Instant",
    badgeColor: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    title: "Document Analyzer",
    description:
      "Upload any document — PDF, DOCX, TXT — and get a full AI report: issues found, solutions provided, health score, and recommendations.",
    features: ["Issues & solutions", "Health score", "Email · Slack · Notion"],
    cta: "Analyze a Document",
  },
  {
    href: "/simulate",
    icon: MessageSquare,
    accent: "#22c55e",
    badge: "Sales training",
    badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    title: "AI Sales Simulator",
    description:
      "Practice high-stakes sales conversations with a realistic AI buyer. Get scored on confidence, persuasion, clarity, and objection handling.",
    features: ["Realistic AI buyer", "Live scoring", "Detailed feedback"],
    cta: "Start Simulation",
  },
];

export default async function AIToolsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-10"
        >
          <ArrowLeft size={15} /> Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c47d3b]/10 border border-[#c47d3b]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#c47d3b] animate-pulse" />
            <span className="text-xs font-medium text-[#c47d3b] uppercase tracking-wider">AI Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">All AI Tools</h1>
          <p className="text-zinc-400 max-w-xl">
            Everything you need to level up your marketing and sales — powered by AI.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 gap-5 mb-10">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.href}
                className="bg-[#111118] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:border-zinc-700 transition-colors group"
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tool.accent}15`, border: `1px solid ${tool.accent}30` }}
                >
                  <Icon size={24} style={{ color: tool.accent }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-white">{tool.title}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tool.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors text-white"
                    style={{ background: tool.accent }}
                  >
                    {tool.cta} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade banner */}
        <div className="bg-[#111118] border border-[#c47d3b]/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center flex-shrink-0">
            <Crown size={22} className="text-[#c47d3b]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-lg mb-1">Unlock unlimited access</h3>
            <p className="text-zinc-400 text-sm">
              Free tier limits apply to AI Coach (15 min/day). Upgrade to Pro for unlimited sessions across all tools.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            View Pricing →
          </Link>
        </div>

      </div>
    </div>
  );
}
