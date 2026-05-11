"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Monitor,
  MonitorOff,
  Send,
  Loader2,
  ArrowLeft,
  Clock,
  Crown,
  Bot,
  User,
  Zap,
  AlertTriangle,
  X,
  RefreshCw,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_LIMIT_SECONDS = 15 * 60; // 15 minutes
const CAPTURE_INTERVAL_MS = 6000;   // capture frame every 6 seconds
const JPEG_QUALITY = 0.45;          // lower = faster + cheaper

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type SessionState = "idle" | "requesting" | "active" | "paused" | "expired" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function captureFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): string | null {
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = Math.min(video.videoWidth, 1280);
    canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
    return dataUrl.split(",")[1]; // strip "data:image/jpeg;base64,"
  } catch {
    return null;
  }
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center mx-auto mb-5">
            <Crown size={28} className="text-[#c47d3b]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Free Time Used</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            You&apos;ve used your 15-minute free session. Upgrade to Pro for unlimited AI coaching sessions, priority analysis, and advanced marketing guidance.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 text-left space-y-3">
            {[
              "Unlimited screen coaching sessions",
              "Real-time ad copy & campaign guidance",
              "Priority AI response speed",
              "Session history & insights",
              "Slack & Notion report delivery",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-4 h-4 rounded-full bg-[#c47d3b]/20 border border-[#c47d3b]/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c47d3b]" />
                </div>
                {f}
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="block w-full bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-3.5 rounded-xl transition-colors text-center mb-3"
          >
            Upgrade to Pro →
          </Link>
          <button
            onClick={onClose}
            className="w-full text-zinc-500 hover:text-zinc-300 text-sm transition-colors py-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AICoachPage() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FREE_LIMIT_SECONDS);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [autoMode, setAutoMode] = useState(true); // auto-capture every N seconds
  const [lastFrameTime, setLastFrameTime] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const captureRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<Message[]>([]);

  // Keep history ref in sync
  useEffect(() => {
    historyRef.current = messages;
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Countdown timer
  useEffect(() => {
    if (sessionState === "active") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            handleExpire();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState]);

  function handleExpire() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (captureRef.current) clearInterval(captureRef.current);
    setSessionState("expired");
    setShowUpgrade(true);
  }

  const analyzeFrame = useCallback(async (userMsg?: string) => {
    if (!videoRef.current || !canvasRef.current) return;
    if (sessionState !== "active") return;

    const frameBase64 = captureFrame(videoRef.current, canvasRef.current);
    if (!frameBase64) return;

    setIsAnalyzing(true);
    setLastFrameTime(Date.now());

    // Add user message to chat if they typed something
    if (userMsg?.trim()) {
      const userEntry: Message = { role: "user", content: userMsg.trim(), timestamp: Date.now() };
      setMessages((prev) => [...prev, userEntry]);
    }

    try {
      const res = await fetch("/api/coach/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frameBase64,
          userMessage: userMsg ?? "",
          history: historyRef.current.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const aiEntry: Message = {
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiEntry]);
    } catch (err) {
      console.error("Coach error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Couldn't analyze the screen right now. I'll try again shortly.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [sessionState]);

  // Auto-capture loop
  useEffect(() => {
    if (sessionState === "active" && autoMode) {
      // Initial analysis after 1s
      const initial = setTimeout(() => analyzeFrame(), 1000);
      captureRef.current = setInterval(() => analyzeFrame(), CAPTURE_INTERVAL_MS);
      return () => {
        clearTimeout(initial);
        if (captureRef.current) clearInterval(captureRef.current);
      };
    } else {
      if (captureRef.current) clearInterval(captureRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState, autoMode]);

  async function startScreenShare() {
    setSessionState("requesting");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 5, width: { ideal: 1280 } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Handle user stopping share via browser UI
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        stopSession();
      });

      setSessionState("active");
      setMessages([{
        role: "assistant",
        content: "👋 I can see your screen! I'll analyze it every few seconds and guide you through your marketing tasks. You can also ask me anything specific by typing below.\n\n✅ **Do this next:** Tell me what marketing task you're working on so I can give you focused guidance.",
        timestamp: Date.now(),
      }]);
    } catch (err) {
      console.error("Screen share error:", err);
      setSessionState("error");
    }
  }

  function stopSession() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (captureRef.current) clearInterval(captureRef.current);
    if (videoRef.current) videoRef.current.srcObject = null;
    setSessionState("idle");
  }

  function togglePause() {
    if (sessionState === "active") {
      if (captureRef.current) clearInterval(captureRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setSessionState("paused");
    } else if (sessionState === "paused") {
      setSessionState("active");
    }
  }

  async function handleSend() {
    if (!input.trim() || isAnalyzing) return;
    const msg = input.trim();
    setInput("");

    if (sessionState === "active") {
      await analyzeFrame(msg);
    } else {
      // No screen share — just chat
      setMessages((prev) => [...prev, { role: "user", content: msg, timestamp: Date.now() }]);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please start a screen sharing session so I can see your screen and give you specific guidance. Click **Start AI Coach Session** above.",
          timestamp: Date.now(),
        },
      ]);
    }
  }

  const timerColor =
    timeLeft > 300 ? "text-emerald-400" : timeLeft > 60 ? "text-amber-400" : "text-red-400";
  const timerBg =
    timeLeft > 300 ? "bg-emerald-500/10 border-emerald-500/20" : timeLeft > 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Hidden video + canvas for frame capture */}
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="border-b border-zinc-800 bg-[#0d0d14] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-800/50 flex-shrink-0"
          >
            <ArrowLeft size={13} /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center flex-shrink-0">
            <Monitor size={15} className="text-[#c47d3b]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">AI Marketing Coach</div>
            <div className="text-xs text-zinc-500 hidden sm:block">Screen-aware guidance</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Timer */}
          {(sessionState === "active" || sessionState === "paused" || sessionState === "expired") && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold ${timerBg} ${timerColor}`}>
              <Clock size={12} />
              {formatTime(timeLeft)}
            </div>
          )}

          {/* Auto mode toggle */}
          {sessionState === "active" && (
            <button
              onClick={() => setAutoMode((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                autoMode
                  ? "bg-[#c47d3b]/10 border-[#c47d3b]/30 text-[#c47d3b]"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              <RefreshCw size={11} className={autoMode ? "animate-spin" : ""} style={{ animationDuration: "3s" }} />
              <span className="hidden sm:inline">{autoMode ? "Auto" : "Manual"}</span>
            </button>
          )}

          {/* Upgrade */}
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 bg-[#c47d3b]/10 hover:bg-[#c47d3b]/20 border border-[#c47d3b]/30 text-[#c47d3b] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          >
            <Crown size={12} /> Pro
          </Link>

          {/* Session controls */}
          {sessionState === "idle" || sessionState === "error" ? (
            <button
              onClick={startScreenShare}
              className="flex items-center gap-2 bg-[#c47d3b] hover:bg-[#a66830] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Monitor size={14} /> Start Session
            </button>
          ) : sessionState === "requesting" ? (
            <div className="flex items-center gap-2 text-zinc-400 text-sm px-4 py-2">
              <Loader2 size={14} className="animate-spin" /> Waiting...
            </div>
          ) : sessionState === "active" || sessionState === "paused" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
              >
                {sessionState === "paused" ? <><Zap size={12} /> Resume</> : <><Clock size={12} /> Pause</>}
              </button>
              <button
                onClick={stopSession}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/40 text-zinc-400 hover:text-red-400 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              >
                <MonitorOff size={12} /> Stop
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Screen preview (left, hidden on mobile) */}
        {(sessionState === "active" || sessionState === "paused") && (
          <div className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 border-r border-zinc-800 bg-[#0d0d14] flex-col">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Screen Preview</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${sessionState === "active" ? "bg-red-500 animate-pulse" : "bg-zinc-600"}`} />
                <span className="text-xs text-zinc-600">{sessionState === "active" ? "Live" : "Paused"}</span>
              </div>
            </div>
            <div className="flex-1 p-3 flex items-center justify-center">
              <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  muted
                  playsInline
                  style={{ display: "block" }}
                />
              </div>
            </div>
            {lastFrameTime && (
              <div className="px-4 py-2 border-t border-zinc-800 text-xs text-zinc-600 text-center">
                Last analyzed {Math.round((Date.now() - lastFrameTime) / 1000)}s ago
              </div>
            )}
          </div>
        )}

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Idle / error state */}
          {(sessionState === "idle" || sessionState === "error") && (
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="max-w-lg w-full text-center">
                {sessionState === "error" && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2 justify-center mb-6">
                    <AlertTriangle size={15} />
                    Screen share was denied or cancelled. Try again.
                  </div>
                )}

                <div className="w-20 h-20 rounded-2xl bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center mx-auto mb-6">
                  <Monitor size={36} className="text-[#c47d3b]" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">AI Marketing Coach</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                  Share your screen and get real-time AI guidance on ads, email campaigns, social content, landing pages, and more.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                  {[
                    { icon: "📢", title: "Ad Copy", desc: "Google, Meta, LinkedIn ads" },
                    { icon: "📧", title: "Email Campaigns", desc: "Subject lines, CTAs, flows" },
                    { icon: "📱", title: "Social Media", desc: "Captions, hashtags, strategy" },
                    { icon: "📊", title: "Analytics", desc: "Interpret data, find wins" },
                  ].map((f) => (
                    <div key={f.title} className="bg-[#111118] border border-zinc-800 rounded-xl p-4">
                      <div className="text-xl mb-2">{f.icon}</div>
                      <div className="text-sm font-semibold text-white mb-0.5">{f.title}</div>
                      <div className="text-xs text-zinc-500">{f.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400/80 mb-6 flex items-center gap-2 justify-center">
                  <Clock size={13} />
                  Free tier: 15 minutes per session · <Link href="/pricing" className="underline hover:text-amber-300">Upgrade for unlimited</Link>
                </div>

                <button
                  onClick={startScreenShare}
                  className="w-full bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  <Monitor size={18} /> Start AI Coach Session
                </button>
              </div>
            </div>
          )}

          {/* Active / paused / expired chat */}
          {(sessionState === "active" || sessionState === "paused" || sessionState === "expired") && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {sessionState === "paused" && (
                  <div className="flex items-center justify-center">
                    <div className="bg-zinc-800/80 border border-zinc-700 rounded-full px-4 py-2 text-xs text-zinc-400 flex items-center gap-2">
                      <Clock size={12} /> Session paused — timer stopped
                    </div>
                  </div>
                )}

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
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "assistant"
                        ? "bg-[#111118] border border-zinc-800 text-zinc-200 rounded-tl-sm"
                        : "bg-[#c47d3b] text-white rounded-tr-sm"
                    }`}>
                      {msg.role === "assistant" && (
                        <div className="text-xs text-zinc-500 mb-1.5 font-medium flex items-center gap-1.5">
                          <Bot size={10} /> AI Coach
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#c47d3b]/20 border border-[#c47d3b]/30 flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-[#c47d3b]" />
                    </div>
                    <div className="bg-[#111118] border border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
                        <Bot size={10} /> Analyzing screen...
                      </div>
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
              <div className="border-t border-zinc-800 bg-[#0d0d14] px-4 py-3 flex-shrink-0">
                <div className="flex gap-3 items-end max-w-3xl mx-auto">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={
                      sessionState === "expired"
                        ? "Session expired — upgrade for more time"
                        : "Ask about what's on your screen... (Enter to send)"
                    }
                    disabled={sessionState === "expired"}
                    rows={2}
                    className="flex-1 bg-[#111118] border border-zinc-700 focus:border-[#c47d3b] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none transition-colors disabled:opacity-40"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isAnalyzing || sessionState === "expired"}
                      className="w-11 h-11 bg-[#c47d3b] hover:bg-[#a66830] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                    >
                      {isAnalyzing ? <Loader2 size={15} className="animate-spin text-white" /> : <Send size={15} className="text-white" />}
                    </button>
                    {sessionState === "active" && (
                      <button
                        onClick={() => analyzeFrame()}
                        disabled={isAnalyzing}
                        title="Analyze now"
                        className="w-11 h-11 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors"
                      >
                        <RefreshCw size={14} className={`text-zinc-400 ${isAnalyzing ? "animate-spin" : ""}`} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-center text-xs text-zinc-700 mt-2">
                  {sessionState === "active"
                    ? autoMode
                      ? "Auto-analyzing every 6 seconds · Ask anything specific below"
                      : "Manual mode — click ↑ to analyze or ask a question"
                    : sessionState === "paused"
                    ? "Session paused — resume to continue analysis"
                    : "Upgrade to Pro for unlimited sessions"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
