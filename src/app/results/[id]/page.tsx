import { createServiceClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, MessageSquare, Target, Shield, ChevronRight } from "lucide-react";

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#1a1a24" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: score } = await supabase
    .from("scores")
    .select("*")
    .eq("conversation_id", id)
    .single();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (!score) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-zinc-400">
        Results not found or still processing.
      </div>
    );
  }

  const scoreColor = (s: number) => s >= 8 ? "#22c55e" : s >= 6 ? "#c47d3b" : "#ef4444";

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c47d3b]/10 border border-[#c47d3b]/20 mb-4">
            <span className="text-xs font-medium text-[#c47d3b] uppercase tracking-wider">Session Complete</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Results</h1>
          <p className="text-zinc-400">SaaS Sales Objection Call · Marcus Chen</p>
        </div>

        {/* Overall score */}
        <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-8 mb-6 text-center">
          <div className="text-7xl font-bold mb-2" style={{ color: scoreColor(score.overall_score) }}>
            {score.overall_score}<span className="text-3xl text-zinc-500">/10</span>
          </div>
          <div className="text-zinc-400 text-sm uppercase tracking-wider font-medium">Overall Score</div>
        </div>

        {/* Score breakdown */}
        <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-8 mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-8">Score Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            <ScoreRing score={score.confidence_score} label="Confidence" color={scoreColor(score.confidence_score)} />
            <ScoreRing score={score.persuasion_score} label="Persuasion" color={scoreColor(score.persuasion_score)} />
            <ScoreRing score={score.clarity_score} label="Clarity" color={scoreColor(score.clarity_score)} />
            <ScoreRing score={score.objection_score} label="Objections" color={scoreColor(score.objection_score)} />
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-8 mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">AI Feedback</h2>
          <p className="text-zinc-200 leading-relaxed">{score.feedback}</p>
        </div>

        {/* Weaknesses + Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111118] border border-red-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target size={14} /> Weaknesses
            </h3>
            <ul className="space-y-3">
              {score.weaknesses?.map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                  <ChevronRight size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#111118] border border-emerald-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={14} /> Suggestions
            </h3>
            <ul className="space-y-3">
              {score.suggestions?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                  <ChevronRight size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transcript */}
        {messages && messages.length > 0 && (
          <details className="bg-[#111118] border border-zinc-800 rounded-2xl mb-8 group">
            <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition-colors">
              <MessageSquare size={14} />
              View full transcript ({messages.length} messages)
            </summary>
            <div className="px-6 pb-6 space-y-3 border-t border-zinc-800 pt-4">
              {messages.map((m, i) => (
                <div key={i} className={`text-sm ${m.role === "user" ? "text-zinc-200" : "text-zinc-400"}`}>
                  <span className="font-semibold text-xs uppercase tracking-wider mr-2 text-zinc-500">
                    {m.role === "user" ? "You" : "Marcus"}:
                  </span>
                  {m.content}
                </div>
              ))}
            </div>
          </details>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/simulate"
            className="flex-1 bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
          >
            Try Again <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
          >
            <Shield size={16} /> View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
