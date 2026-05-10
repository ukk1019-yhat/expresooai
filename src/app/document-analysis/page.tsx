import Link from "next/link";
import { ArrowLeft, FileSearch, Zap, Share2, Shield } from "lucide-react";
import { DocumentAnalyzer } from "@/components/sections/DocumentAnalyzer";

export const metadata = {
  title: "Document Analysis · EXPRESSO AI",
  description:
    "Upload any document and get an instant AI-powered analysis with issues, solutions, and recommendations. Share results to Email, Slack, or Notion.",
};

export default async function DocumentAnalysisPage() {

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back nav */}
        <div className="flex items-center gap-3 mb-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/50"
          >
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-500 text-sm">Document Analysis</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c47d3b]/10 border border-[#c47d3b]/20 mb-4">
            <FileSearch size={13} className="text-[#c47d3b]" />
            <span className="text-xs font-medium text-[#c47d3b] uppercase tracking-wider">
              AI Document Intelligence
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Analyze Any Document
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Upload a document and get an instant AI-powered report — issues identified,
            solutions provided, and results delivered to your team.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { icon: <Zap size={13} />, label: "Instant Analysis" },
            { icon: <Shield size={13} />, label: "Issues & Solutions" },
            { icon: <Share2 size={13} />, label: "Email · Slack · Notion" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium"
            >
              <span className="text-[#c47d3b]">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>

        {/* Main analyzer */}
        <DocumentAnalyzer />

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-700 mt-10">
          Supports TXT, Markdown, CSV, JSON, PDF, and DOCX · Max 5MB · Powered by OpenRouter
        </p>
      </div>
    </div>
  );
}
