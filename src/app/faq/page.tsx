import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | EXPRESSO AI",
  description: "Frequently asked questions about EXPRESSO AI's product, technology, and use cases.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-[#2c1e16] mb-6">Frequently Asked Questions</h1>
        <p className="text-lg text-[#6e5646] mb-16">
          Everything you need to know about the product, underlying technology, and how enterprises are deploying EXPRESSO AI.
        </p>

        {/* Section 1: Product */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#8b5a2b] mb-8 border-b border-[#d4c3ab] pb-4">Product</h2>
          <div className="space-y-8">
            <FAQItem 
              question="What exactly is EXPRESSO AI?"
              answer="EXPRESSO AI is an enterprise behavioral intelligence platform. We use adaptive AI roleplay simulations to help your team practice high-stakes conversations—such as sales calls, negotiations, and interviews—while providing real-time, objective scoring on metrics like persuasion, clarity, and emotional intelligence."
            />
            <FAQItem 
              question="How is this different from a standard LMS or video training?"
              answer="Standard training is static and passive. EXPRESSO AI is interactive and adaptive. Instead of watching a video about handling objections, your team actually practices handling dynamic objections thrown at them by an AI that reacts to their tone, pacing, and choice of words in real-time."
            />
            <FAQItem 
              question="Can we customize the AI personas and scenarios?"
              answer="Yes. Our enterprise plan allows you to inject your own playbooks, product details, and buyer personas into the system. The AI will adopt the exact persona of your most difficult clients or prospects."
            />
          </div>
        </section>

        {/* Section 2: Technology */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#8b5a2b] mb-8 border-b border-[#d4c3ab] pb-4">Technology</h2>
          <div className="space-y-8">
            <FAQItem 
              question="Is this just a wrapper around ChatGPT?"
              answer="No. While we leverage state-of-the-art LLMs, our proprietary Behavioral Engine decouples conversation generation from behavioral analysis. We use custom models trained specifically on conversational psychology and enterprise negotiation to ensure hyper-realistic, low-latency (sub-200ms) interactions."
            />
            <FAQItem 
              question="How does the real-time scoring work?"
              answer="Our system processes voice input across 500+ micro-dimensions in real-time. It evaluates acoustic features (tone, pacing, volume) and semantic features (logic, empathy, objection handling) simultaneously, aggregating them into clear metrics like 'Persuasion' and 'Emotional Control'."
            />
            <FAQItem 
              question="Is our data secure?"
              answer="Absolutely. We are SOC2 Type II compliant. Enterprise data used to generate scenarios is siloed, and conversational data from your team's simulations is never used to train our base models."
            />
          </div>
        </section>

        {/* Section 3: Use Cases */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#8b5a2b] mb-8 border-b border-[#d4c3ab] pb-4">Use Cases</h2>
          <div className="space-y-8">
            <FAQItem 
              question="How do Sales teams use EXPRESSO AI?"
              answer="Sales teams use the platform to practice discovery calls, pitch presentations, and complex pricing negotiations. It reduces ramp time for new reps by 35% by allowing them to fail safely in a simulation rather than burning live leads."
            />
            <FAQItem 
              question="Can this be used for Leadership & Management?"
              answer="Yes. Executives and managers use EXPRESSO AI to practice difficult performance reviews, crisis communication, and board presentations, resulting in a 40% increase in reported communication confidence."
            />
            <FAQItem 
              question="Is there an application for Customer Support?"
              answer="Customer Support teams use the platform to simulate irate customers and complex edge-cases. It helps agents build empathy and master de-escalation tactics, which has proven to reduce actual ticket escalations by up to 50%."
            />
          </div>
        </section>

        <div className="mt-24 p-8 bg-[#f4ebd8] border border-[#d4c3ab] rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-[#2c1e16] mb-4">Still have questions?</h3>
          <p className="text-[#6e5646] mb-8">We'd love to show you how EXPRESSO AI can transform your organization.</p>
          <a 
            href="https://calendly.com/ukkukk97/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#704823] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8b5a2b] transition-colors shadow-lg shadow-orange-600/20"
          >
            Book an Enterprise Pilot
          </a>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-[#fdfbf7] p-6 rounded-xl border border-[#e3d5c1] hover:border-[#d4c3ab] transition-colors">
      <h3 className="text-lg font-semibold text-[#2c1e16] mb-3">{question}</h3>
      <p className="text-[#6e5646] leading-relaxed">{answer}</p>
    </div>
  );
}
