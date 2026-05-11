import Link from "next/link";
import { Check, Crown, Zap, ArrowLeft } from "lucide-react";

const FREE_FEATURES = [
  "15 min AI coach session per day",
  "Screen-aware marketing guidance",
  "Document analysis (3/day)",
  "AI sales simulation (3 sessions)",
  "Email report delivery",
];

const PRO_FEATURES = [
  "Unlimited AI coach sessions",
  "Priority AI response speed",
  "Unlimited document analysis",
  "Unlimited sales simulations",
  "Slack & Notion integrations",
  "Session history & insights",
  "Advanced marketing playbooks",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-10"
        >
          <ArrowLeft size={15} /> Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c47d3b]/10 border border-[#c47d3b]/20 mb-4">
            <Crown size={13} className="text-[#c47d3b]" />
            <span className="text-xs font-medium text-[#c47d3b] uppercase tracking-wider">Simple Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Upgrade your marketing
          </h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Start free. Upgrade when you need more time and power.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Free */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-8">
            <div className="mb-6">
              <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Free</div>
              <div className="text-5xl font-bold text-white mb-1">$0</div>
              <div className="text-zinc-500 text-sm">Forever free</div>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={15} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/ai-coach"
              className="block w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-3.5 rounded-xl text-center transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-[#111118] border border-[#c47d3b]/40 rounded-2xl p-8 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#c47d3b]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-semibold text-[#c47d3b] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Crown size={13} /> Pro
                  </div>
                  <div className="text-5xl font-bold text-white mb-1">
                    $29<span className="text-2xl text-zinc-400 font-normal">/mo</span>
                  </div>
                  <div className="text-zinc-500 text-sm">Billed monthly</div>
                </div>
                <div className="bg-[#c47d3b]/10 border border-[#c47d3b]/20 rounded-full px-3 py-1 text-xs font-semibold text-[#c47d3b]">
                  Most Popular
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-zinc-200">
                    <Check size={15} className="text-[#c47d3b] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                onClick={() => alert("Stripe integration coming soon! Contact us to upgrade early.")}
              >
                <Zap size={16} /> Upgrade to Pro
              </button>
              <p className="text-center text-xs text-zinc-600 mt-3">
                Cancel anytime · Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Common questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "How does the 15-minute free limit work?",
                a: "Each day you get a fresh 15-minute AI coach session. The timer counts down while your screen is being analyzed. Pausing the session stops the timer.",
              },
              {
                q: "Does the AI actually see my screen?",
                a: "Yes. When you start a session, your browser asks permission to share your screen. The AI captures a frame every 6 seconds and analyzes it to give you specific, contextual guidance.",
              },
              {
                q: "Is my screen data stored?",
                a: "No. Screen frames are sent directly to the AI model for analysis and are never stored on our servers. Only the text responses are kept for your session history.",
              },
              {
                q: "What marketing tools does it work with?",
                a: "Any tool visible in your browser — Google Ads, Meta Ads Manager, Mailchimp, HubSpot, Canva, Notion, Google Analytics, Shopify, and more.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-zinc-800 pb-6 last:border-0 last:pb-0">
                <h3 className="text-sm font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
