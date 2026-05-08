"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2c1e16] mb-4">Contact Our Team</h1>
          <p className="text-[#6e5646]">
            Get in touch to learn how EXPRESSO AI can transform your organization's communication.
          </p>
        </div>

        <div className="bg-[#f4ebd8] p-8 rounded-2xl border border-[#d4c3ab]">
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#8b5a2b]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#2c1e16] mb-2">Message Sent!</h2>
              <p className="text-[#6e5646]">We'll be in touch with you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#2c1e16] mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] focus:outline-none focus:border-[#8b5a2b] transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#2c1e16] mb-2">Work Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] focus:outline-none focus:border-[#8b5a2b] transition-colors"
                  placeholder="jane@company.com"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-[#2c1e16] mb-2">Company</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] focus:outline-none focus:border-[#8b5a2b] transition-colors"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[#2c1e16] mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  rows={4}
                  className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] focus:outline-none focus:border-[#8b5a2b] transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              {status === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                  There was an error sending your message. Please try again later.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full bg-[#704823] text-white font-semibold py-4 rounded-lg hover:bg-[#8b5a2b] transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
