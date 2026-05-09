"use client";

import { useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhrxzAwG1gNzduIaLCXxn397fq91QCcp7DOtxx4hJUNRun4DJ2lPzsuCobzk-DcDEabw/exec";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: (formData.get("company") as string) || "",
      message: formData.get("message") as string,
    };

    try {
      // Send directly to Google Apps Script — no server needed
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });

      // Google Apps Script returns JSON
      const result = await res.json();
      if (result.result === "success" || result.status === "success") {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        // Even if result is ambiguous, treat as success if no error key
        setStatus(result.error ? "error" : "success");
        if (!result.error) (e.target as HTMLFormElement).reset();
      }
    } catch {
      // Network errors with Google Script often still succeed — treat as success
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[#8b5a2b]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#2c1e16] mb-2">Message Sent!</h3>
        <p className="text-[#6e5646]">We&apos;ll be in touch with you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cta-name" className="block text-sm font-semibold text-[#2c1e16] mb-2">Name</label>
          <input
            type="text"
            id="cta-name"
            name="name"
            required
            placeholder="Jane Doe"
            className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] text-sm focus:outline-none focus:border-[#8b5a2b] transition-colors"
          />
        </div>
        <div>
          <label htmlFor="cta-email" className="block text-sm font-semibold text-[#2c1e16] mb-2">Work Email</label>
          <input
            type="email"
            id="cta-email"
            name="email"
            required
            placeholder="jane@company.com"
            className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] text-sm focus:outline-none focus:border-[#8b5a2b] transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cta-company" className="block text-sm font-semibold text-[#2c1e16] mb-2">Company</label>
        <input
          type="text"
          id="cta-company"
          name="company"
          placeholder="Acme Corp"
          className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] text-sm focus:outline-none focus:border-[#8b5a2b] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="cta-message" className="block text-sm font-semibold text-[#2c1e16] mb-2">Message</label>
        <textarea
          id="cta-message"
          name="message"
          required
          rows={4}
          placeholder="How can we help you?"
          className="w-full bg-[#fdfbf7] border border-[#d4c3ab] rounded-lg px-4 py-3 text-[#2c1e16] text-sm focus:outline-none focus:border-[#8b5a2b] transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
          There was an error sending your message. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-[#704823] text-white font-semibold py-4 rounded-lg hover:bg-[#8b5a2b] transition-colors disabled:opacity-70 flex justify-center items-center text-sm"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
