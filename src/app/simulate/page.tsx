"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Square, Clock, User, Bot, Loader2 } from "lucide-react";
import { BUYER_PERSONA } from "@/lib/gemini";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function SimulatePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  async function startSession() {
    setIsStarting(true);
    try {
      const res = await fetch("/api/session/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setConversationId(data.conversationId);
      setMessages([{ role: "assistant", content: data.openingMessage }]);
      setStarted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to start session. Check your API keys.");
    } finally {
      setIsStarting(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
          history: messages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Connection error. Please try again.",
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  async function endSession() {
    if (!conversationId || isEnding) return;
    setIsEnding(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/results/${conversationId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze session. Please try again.");
      setIsEnding(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Pre-start screen
  if (!started) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c47d3b]/10 border border-[#c47d3b]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#c47d3b] animate-pulse" />
            <span className="text-xs font-medium text-[#c47d3b] uppercase tracking-wider">SaaS Sales Objection Call</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            You&apos;re about to pitch to<br />
            <span className="text-[#c47d3b]">{BUYER_PERSONA.name}</span>
          </h1>
          <p className="text-zinc-400 mb-2">{BUYER_PERSONA.title} · {BUYER_PERSONA.company}</p>
          <p className="text-zinc-500 text-sm mb-10">Personality: {BUYER_PERSONA.personality}</p>

          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">His goals in this call</h3>
            <ul className="space-y-2">
              {BUYER_PERSONA.goals.map((g, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-400 text-xs font-bold">{i + 1}</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-8 text-sm text-amber-400/80">
            Tip: Be specific, confident, and back up your claims with numbers. Vague answers will be challenged.
          </div>

          <button
            onClick={startSession}
            disabled={isStarting}
            className="w-full bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-lg"
          >
            {isStarting ? (
              <><Loader2 size={20} className="animate-spin" /> Starting simulation...</>
            ) : (
              "Start Simulation →"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Active simulation
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-[#0d0d14] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <User size={18} className="text-zinc-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{BUYER_PERSONA.name}</div>
            <div className="text-xs text-zinc-500">{BUYER_PERSONA.title} · {BUYER_PERSONA.company}</div>
          </div>
          <div className="ml-2 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
            Difficulty {BUYER_PERSONA.difficulty}/10
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Clock size={14} />
            <span className="font-mono">{formatTime(elapsed)}</span>
          </div>
          <button
            onClick={endSession}
            disabled={isEnding || messages.length < 3}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/40 text-zinc-300 hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEnding ? (
              <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
            ) : (
              <><Square size={14} /> End Session</>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
              msg.role === "assistant"
                ? "bg-[#c47d3b]/20 border border-[#c47d3b]/30"
                : "bg-zinc-700 border border-zinc-600"
            }`}>
              {msg.role === "assistant"
                ? <Bot size={14} className="text-[#c47d3b]" />
                : <User size={14} className="text-zinc-300" />
              }
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "assistant"
                ? "bg-[#111118] border border-zinc-800 text-zinc-200 rounded-tl-sm"
                : "bg-[#c47d3b] text-white rounded-tr-sm"
            }`}>
              {msg.role === "assistant" && (
                <div className="text-xs text-zinc-500 mb-1 font-medium">{BUYER_PERSONA.name}</div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c47d3b]/20 border border-[#c47d3b]/30 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-[#c47d3b]" />
            </div>
            <div className="bg-[#111118] border border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 bg-[#0d0d14] px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 bg-[#111118] border border-zinc-700 focus:border-[#c47d3b] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 bg-[#c47d3b] hover:bg-[#a66830] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-2">
          {messages.length < 3 ? `Exchange at least ${3 - messages.length} more message${3 - messages.length !== 1 ? "s" : ""} before ending` : "Ready to end session when you're done"}
        </p>
      </div>
    </div>
  );
}
