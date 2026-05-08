"use client";

import { motion } from "framer-motion";
import { BarChart3, Activity, TrendingUp, Target, BrainCircuit } from "lucide-react";

export function AnalyticsDashboard() {
  return (
    <section className="py-32 bg-zinc-950 relative border-t border-white/5" id="analytics">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-sm font-semibold tracking-widest text-orange-500 uppercase mb-3">Enterprise Analytics</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white">Measure What Was Previously Unmeasurable</h3>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto text-lg">
            Move beyond completion rates. Track persuasion, adaptability, and emotional control across your entire organization in real-time.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-2xl border border-white/10 p-2 md:p-6 shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <BarChart3 className="text-orange-500" size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold">Global Sales Team Performance</h4>
                <p className="text-xs text-zinc-500">Last 30 Days • 1,240 Simulations Completed</p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-md text-xs font-medium text-zinc-300 border border-white/5">Export CSV</span>
              <span className="px-3 py-1 bg-orange-600 rounded-md text-xs font-medium text-white shadow-lg shadow-orange-600/20">Generate Report</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Key Metrics */}
            <div className="space-y-6">
              <MetricBox title="Overall Persuasion" value="86.4" trend="+4.2%" positive icon={<Target size={16} />} />
              <MetricBox title="Avg. Emotional Control" value="91.2" trend="+1.8%" positive icon={<Activity size={16} />} />
              <MetricBox title="Objection Handling" value="74.5" trend="-2.1%" positive={false} icon={<BrainCircuit size={16} />} />
            </div>

            {/* Middle Column: Emotional Trend Graph Mockup */}
            <div className="md:col-span-2 bg-black/40 border border-white/5 rounded-xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h5 className="text-sm font-semibold text-white">Sentiment Trajectory vs Conversion</h5>
                <span className="text-xs text-zinc-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> Buyer Receptivity
                </span>
              </div>
              
              {/* Fake Graph */}
              <div className="h-[200px] flex items-end justify-between gap-2">
                {[40, 45, 30, 55, 65, 60, 80, 85, 92, 88, 95].map((height, i) => (
                  <div key={i} className="w-full relative group">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className={`w-full rounded-t-sm ${height > 70 ? 'bg-orange-500' : height > 50 ? 'bg-orange-500/50' : 'bg-zinc-700'}`}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {height}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-zinc-500 font-medium uppercase tracking-widest border-t border-white/5 pt-2">
                <span>0m</span>
                <span>5m</span>
                <span>10m</span>
                <span>15m</span>
              </div>
            </div>

          </div>

          {/* Bottom Area: Heatmap Mockup */}
          <div className="mt-6 bg-black/40 border border-white/5 rounded-xl p-6">
            <h5 className="text-sm font-semibold text-white mb-4">Skill Heatmap by Department</h5>
            <div className="space-y-3">
              <HeatmapRow name="Enterprise Sales" scores={[92, 88, 95, 82]} />
              <HeatmapRow name="SDR Team" scores={[75, 68, 80, 72]} />
              <HeatmapRow name="Customer Success" scores={[88, 94, 85, 90]} />
            </div>
            <div className="flex justify-end gap-8 mt-4 text-[10px] text-zinc-500 font-medium uppercase tracking-widest w-full">
              <span className="w-16 text-center">Discovery</span>
              <span className="w-16 text-center">Empathy</span>
              <span className="w-16 text-center">Closing</span>
              <span className="w-16 text-center">Clarity</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}

function MetricBox({ title, value, trend, positive, icon }: { title: string, value: string, trend: string, positive: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-black/40 border border-white/5 p-5 rounded-xl">
      <div className="flex items-center gap-2 text-zinc-400 mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className={`text-xs font-semibold mb-1 flex items-center gap-1 ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {trend}
        </span>
      </div>
    </div>
  );
}

function HeatmapRow({ name, scores }: { name: string, scores: number[] }) {
  const getColor = (score: number) => {
    if (score >= 90) return 'bg-orange-500';
    if (score >= 80) return 'bg-orange-500/70';
    if (score >= 70) return 'bg-orange-500/40';
    return 'bg-zinc-800';
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-zinc-300 w-32">{name}</span>
      <div className="flex-1 flex justify-end gap-2">
        {scores.map((score, i) => (
          <div 
            key={i} 
            className={`w-16 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white/90 ${getColor(score)} transition-colors hover:brightness-110 cursor-default`}
            title={`Score: ${score}`}
          >
            {score}
          </div>
        ))}
      </div>
    </div>
  );
}
