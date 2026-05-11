import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowRight, TrendingUp, Clock, BarChart2, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServiceClient();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, scenario_name, status, created_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const conversationIds = conversations?.map((c) => c.id) ?? [];

  const { data: scores } = conversationIds.length > 0
    ? await supabase
        .from("scores")
        .select("*")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const avgScore = scores && scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length * 10) / 10
    : null;

  const latest = scores && scores.length > 0 ? scores[scores.length - 1] : null;
  const previous = scores && scores.length > 1 ? scores[scores.length - 2] : null;
  const trend = latest && previous ? latest.overall_score - previous.overall_score : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-3 w-fit">
              ← Home
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Your Dashboard</h1>
            <p className="text-zinc-400 text-sm">Track your progress across all simulation sessions</p>
          </div>
          <Link
            href="/simulate"
            className="bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm"
          >
            New Session <ArrowRight size={16} />
          </Link>
          <Link
            href="/ai-tools"
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm"
          >
            <Sparkles size={16} /> AI Tools
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider mb-3">
              <BarChart2 size={14} /> Sessions Completed
            </div>
            <div className="text-4xl font-bold text-white">{conversations?.length ?? 0}</div>
          </div>
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider mb-3">
              <TrendingUp size={14} /> Average Score
            </div>
            <div className="text-4xl font-bold text-white">
              {avgScore !== null ? avgScore : "—"}<span className="text-xl text-zinc-500">/10</span>
            </div>
          </div>
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-wider mb-3">
              <TrendingUp size={14} /> Last vs Previous
            </div>
            <div className={`text-4xl font-bold ${trend === null ? "text-zinc-500" : trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-400" : "text-zinc-300"}`}>
              {trend === null ? "—" : trend > 0 ? `+${trend.toFixed(1)}` : trend.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Score trend chart (simple bar) */}
        {scores && scores.length > 1 && (
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Score Trend</h2>
            <div className="flex items-end gap-3 h-32">
              {scores.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs text-zinc-500 font-mono">{s.overall_score}</div>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(s.overall_score / 10) * 100}%`,
                      background: s.overall_score >= 8 ? "#22c55e" : s.overall_score >= 6 ? "#c47d3b" : "#ef4444",
                      opacity: i === scores.length - 1 ? 1 : 0.5,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-600">
              <span>Session 1</span>
              <span>Session {scores.length}</span>
            </div>
          </div>
        )}

        {/* Session history */}
        <div className="bg-[#111118] border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Session History</h2>
          </div>

          {!conversations || conversations.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-zinc-500 mb-4">No sessions yet.</p>
              <Link href="/simulate" className="text-[#c47d3b] hover:text-[#a66830] text-sm font-medium transition-colors">
                Start your first simulation →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {conversations.map((conv) => {
                const score = scores?.find((s) => s.conversation_id === conv.id);
                return (
                  <Link
                    key={conv.id}
                    href={`/results/${conv.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <Clock size={16} className="text-zinc-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{conv.scenario_name}</div>
                        <div className="text-xs text-zinc-500">
                          {new Date(conv.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {score && (
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{
                            color: score.overall_score >= 8 ? "#22c55e" : score.overall_score >= 6 ? "#c47d3b" : "#ef4444"
                          }}>
                            {score.overall_score}/10
                          </div>
                          <div className="text-xs text-zinc-500">overall</div>
                        </div>
                      )}
                      <ArrowRight size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
