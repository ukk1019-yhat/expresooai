"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Monitor, MonitorOff, Send, Loader2, ArrowLeft, Clock,
  Crown, Bot, User, Zap, AlertTriangle, RefreshCw, Mic, MicOff, Volume2, VolumeX,
  Copy, CheckCircle2,
} from "lucide-react";
import WebcamFaceAnalysis from "@/components/WebcamFaceAnalysis";
import { startPreloadModels } from "@/lib/faceDetection";

// ─── Constants ────────────────────────────────────────────────────────────────
const FREE_LIMIT_SECONDS = 15 * 60;
const CAPTURE_INTERVAL_MS = 20000;
const JPEG_QUALITY = 0.45;

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = { role: "user" | "assistant"; content: string; timestamp: number; };
type SessionState = "idle" | "requesting" | "active" | "paused" | "expired" | "error";
type VoiceState = "off" | "listening" | "processing";

// Web Speech API types (not in TS lib by default)
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: Event) => void) | null;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
}
interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: { length: number; [i: number]: { isFinal: boolean; [j: number]: { transcript: string } } };
}
interface ISpeechRecognitionCtor { new(): ISpeechRecognition; }
declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionCtor;
    webkitSpeechRecognition?: ISpeechRecognitionCtor;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

function captureFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): string | null {
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = Math.min(video.videoWidth, 1280);
    canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY).split(",")[1];
  } catch { return null; }
}

// ─── Extension Bridge ─────────────────────────────────────────────────────────
// Declare chrome global (available when page is loaded inside Chrome with extension)
declare const chrome: {
  runtime: {
    sendMessage: (
      extensionId: string,
      message: unknown,
      callback: (response: { success: boolean; result?: unknown; error?: string }) => void
    ) => void;
    lastError?: { message?: string };
  };
} | undefined;

async function sendToExtension(
  extensionId: string,
  action: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; result?: unknown; error?: string }> {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome?.runtime?.sendMessage) {
      resolve({ success: false, error: "Chrome extension API not available" });
      return;
    }
    try {
      chrome.runtime.sendMessage(extensionId, { action, payload }, (response) => {
        if (chrome?.runtime?.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: false, error: "No response" });
        }
      });
    } catch (e) {
      resolve({ success: false, error: String(e) });
    }
  });
}

// Parse AI response to extract executable actions
function parseActionsFromResponse(response: string): Array<{ action: string; payload: Record<string, unknown> }> {
  const actions: Array<{ action: string; payload: Record<string, unknown> }> = [];

  // Look for ACTION blocks in the response: ACTION:sendMessage PAYLOAD:{...}
  const actionRegex = /ACTION:\s*(\w+)\s*PAYLOAD:\s*(\{[\s\S]*?\})/gi;
  let match;
  while ((match = actionRegex.exec(response)) !== null) {
    try {
      actions.push({ action: match[1], payload: JSON.parse(match[2]) });
    } catch { /* skip malformed */ }
  }
  return actions;
}
function parseResponse(content: string): { type: "text" | "output"; text: string }[] {
  const outputMatch = content.match(/OUTPUT:\s*([\s\S]*?)(?=DONE:|$)/i);
  const doneMatch = content.match(/DONE:\s*([\s\S]*?)$/i);

  if (!outputMatch) {
    return [{ type: "text", text: content }];
  }

  const segments: { type: "text" | "output"; text: string }[] = [];

  // Everything before OUTPUT:
  const before = content.slice(0, content.search(/OUTPUT:/i)).trim();
  if (before) segments.push({ type: "text", text: before });

  // The output block itself
  const outputText = outputMatch[1].trim();
  if (outputText) segments.push({ type: "output", text: outputText });

  // DONE note
  if (doneMatch) {
    const doneText = doneMatch[1].trim();
    if (doneText) segments.push({ type: "text", text: "✅ " + doneText });
  }

  return segments;
}

// ─── Message bubble with copy support ────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);

  if (msg.role === "user") {
    return (
      <div className="flex gap-3 flex-row-reverse">
        <div className="w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={14} className="text-zinc-300" />
        </div>
        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#c47d3b] text-white text-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  const segments = parseResponse(msg.content);
  const outputSegment = segments.find(s => s.type === "output");

  function handleCopy() {
    if (!outputSegment) return;
    navigator.clipboard.writeText(outputSegment.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-[#c47d3b]/20 border border-[#c47d3b]/30 flex items-center justify-center flex-shrink-0 mt-1">
        <Bot size={14} className="text-[#c47d3b]" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-1">
          <Bot size={10} /> AI Agent
        </div>

        {segments.map((seg, i) =>
          seg.type === "output" ? (
            <div key={i} className="bg-zinc-900 border border-[#c47d3b]/30 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-[#c47d3b]/5">
                <span className="text-xs font-semibold text-[#c47d3b] uppercase tracking-wider">
                  Ready to use
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    copied
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                      : "bg-[#c47d3b] hover:bg-[#a66830] text-white"
                  }`}
                >
                  {copied ? <><CheckCircle2 size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <pre className="px-4 py-3 text-sm text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                {seg.text}
              </pre>
            </div>
          ) : (
            <p key={i} className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {seg.text}
            </p>
          )
        )}
      </div>
    </div>
  );
}
function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center mx-auto mb-5">
          <Crown size={28} className="text-[#c47d3b]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Free Time Used</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          You&apos;ve used your 15-minute free session. Upgrade to Pro for unlimited AI coaching, voice control, and automation.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 text-left space-y-3">
          {["Unlimited screen coaching sessions", "Voice command automation", "Real-time ad copy & campaign guidance", "Priority AI response speed", "Slack & Notion report delivery"].map((f) => (
            <div key={f} className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-4 h-4 rounded-full bg-[#c47d3b]/20 border border-[#c47d3b]/40 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c47d3b]" />
              </div>
              {f}
            </div>
          ))}
        </div>
        <Link href="/pricing" className="block w-full bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-3.5 rounded-xl transition-colors text-center mb-3">
          Upgrade to Pro →
        </Link>
        <button onClick={onClose} className="w-full text-zinc-500 hover:text-zinc-300 text-sm transition-colors py-2">
          Maybe later
        </button>
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
  const isAnalyzingRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(FREE_LIMIT_SECONDS);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [lastFrameTime, setLastFrameTime] = useState<number | null>(null);

  // Voice state
  const [voiceState, setVoiceState] = useState<VoiceState>("off");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(false); // off by default

  // Face analysis
  const [showFacePanel, setShowFacePanel] = useState(false);
  const [faceData, setFaceData] = useState<{
    faceDetected: boolean;
    expression: string;
    expressionProb: number;
    mouthOpen: boolean;
    mouthAspectRatio: number;
  } | null>(null);

  // Extension bridge
  const [extensionId, setExtensionId] = useState("");
  const [extensionConnected, setExtensionConnected] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const captureVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const captureRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<Message[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { historyRef.current = messages; }, [messages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Attach stream to preview video after sidebar renders (it's conditionally mounted)
  useEffect(() => {
    if (sessionState === "active" && streamRef.current && previewVideoRef.current) {
      const video = previewVideoRef.current;
      if (!video.srcObject) {
        video.srcObject = streamRef.current;
        video.play().catch(() => {/* autoplay may be blocked, user interaction will trigger */});
      }
    }
  }, [sessionState]); // fires after sessionState becomes "active" and sidebar mounts

  // Init TTS
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak AI response
  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    // Strip emojis and special chars for cleaner speech
    const clean = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").replace(/[👁✅💡⚠️]/g, "").trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 1.05;
    utt.pitch = 1;
    utt.volume = 0.9;
    // Prefer a natural voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"));
    if (preferred) utt.voice = preferred;
    synthRef.current.speak(utt);
  }, [ttsEnabled]);

  // Preload face models when session starts
  useEffect(() => {
    if (sessionState === "active") {
      startPreloadModels();
    }
  }, [sessionState]);

  // Countdown timer
  useEffect(() => {
    if (sessionState === "active") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { handleExpire(); return 0; }
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
    stopVoice();
    setSessionState("expired");
    setShowUpgrade(true);
  }

  // Test extension connection
  async function testExtension(id: string) {
    if (!id.trim()) return;
    const trimmedId = id.trim();

    // Check chrome API is available
    if (typeof chrome === "undefined" || !chrome?.runtime?.sendMessage) {
      alert("Chrome extension API not detected.\n\nMake sure you are using Chrome or Edge browser (not Firefox/Safari).");
      return;
    }

    setLastAction("Testing connection...");
    const res = await sendToExtension(trimmedId, "readPage", {});

    if (res.success) {
      setExtensionConnected(true);
      setExtensionId(trimmedId);
      setLastAction(null);
      // Save to localStorage so it persists across refreshes
      localStorage.setItem("beyonaiExtensionId", trimmedId);
    } else {
      setExtensionConnected(false);
      setLastAction(null);
      alert(
        "Could not connect to extension.\n\n" +
        "Error: " + res.error + "\n\n" +
        "Checklist:\n" +
        "1. Extension is installed at chrome://extensions\n" +
        "2. Extension is ENABLED (blue toggle)\n" +
        "3. You are on a regular website tab (not chrome:// pages)\n" +
        "4. The Extension ID is correct: " + trimmedId + "\n" +
        "5. Try reloading the extension at chrome://extensions"
      );
    }
  }

  // Load saved extension ID on mount
  useEffect(() => {
    const saved = localStorage.getItem("beyonaiExtensionId");
    if (saved) setExtensionId(saved);
  }, []);

  // Execute actions returned by AI on the active tab via extension
  async function executeActions(aiResponse: string, userCommand: string) {
    if (!extensionConnected || !extensionId) return;

    const actions = parseActionsFromResponse(aiResponse);
    if (actions.length === 0) return;

    for (const { action, payload } of actions) {
      setLastAction(`Executing: ${action}...`);
      const result = await sendToExtension(extensionId, action, payload);
      if (!result.success) {
        setLastAction(`Failed: ${action} — ${result.error}`);
      } else {
        setLastAction(`Done: ${action}`);
      }
      await new Promise(r => setTimeout(r, 400));
    }
    setTimeout(() => setLastAction(null), 3000);
  }

  const analyzeFrame = useCallback(async (userMsg?: string) => {
    if (!captureVideoRef.current || !canvasRef.current) return;
    if (sessionState !== "active") return;
    if (isAnalyzingRef.current && !userMsg?.trim()) return;

    const frameBase64 = captureFrame(captureVideoRef.current, canvasRef.current);
    if (!frameBase64) return;

    isAnalyzingRef.current = true;
    setIsAnalyzing(true);
    setLastFrameTime(Date.now());

    if (userMsg?.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: userMsg.trim(), timestamp: Date.now() }]);
    }

    try {
      const res = await fetch("/api/coach/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frameBase64,
          userMessage: userMsg ?? "",
          history: historyRef.current.slice(-8).map((m) => ({ role: m.role, content: m.content })),
          faceData: faceData || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const aiEntry: Message = { role: "assistant", content: data.response, timestamp: Date.now() };
      setMessages((prev) => [...prev, aiEntry]);
      speak(data.response);
      // Auto-execute any actions the AI embedded in its response
      if (extensionConnected) {
        executeActions(data.response, userMsg ?? "");
      }
    } catch (err) {
      console.error("Coach error:", err);
      const errMsg = "Sorry, I couldn't analyze the screen right now. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg, timestamp: Date.now() }]);
      speak(errMsg);
    } finally {
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
    }
  }, [sessionState, speak, faceData]);

  // Auto-capture loop
  useEffect(() => {
    if (sessionState === "active" && autoMode) {
      const initial = setTimeout(() => analyzeFrame(), 3000);
      captureRef.current = setInterval(() => {
        if (!isAnalyzingRef.current) analyzeFrame();
      }, CAPTURE_INTERVAL_MS);
      return () => {
        clearTimeout(initial);
        if (captureRef.current) clearInterval(captureRef.current);
      };
    } else {
      if (captureRef.current) clearInterval(captureRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState, autoMode]);

  // ─── Voice Control ──────────────────────────────────────────────────────────
  function startVoice() {
    if (typeof window === "undefined") return;
    const SpeechRecognitionCtor: ISpeechRecognitionCtor | undefined =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert("Voice control is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setVoiceState("listening");

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setVoiceTranscript(final || interim);
      if (final) {
        setVoiceTranscript("");
        setVoiceState("processing");
        const cmd = final.trim();
        setInput(cmd);
        setTimeout(() => { handleVoiceCommand(cmd); }, 100);
      }
    };

    recognition.onerror = () => {
      setVoiceState("off");
      setVoiceTranscript("");
    };

    recognition.onend = () => {
      if (voiceState === "listening") setVoiceState("off");
      setVoiceTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setVoiceState("off");
    setVoiceTranscript("");
    synthRef.current?.cancel();
  }

  function toggleVoice() {
    if (voiceState !== "off") {
      stopVoice();
    } else {
      startVoice();
    }
  }

  async function handleVoiceCommand(cmd: string) {
    setInput("");
    setVoiceState("off");
    if (!cmd.trim()) return;

    if (sessionState === "active") {
      if (captureRef.current) {
        clearInterval(captureRef.current);
        captureRef.current = setInterval(() => {
          if (!isAnalyzingRef.current) analyzeFrame();
        }, CAPTURE_INTERVAL_MS);
      }
      await analyzeFrame(cmd);
    } else {
      const reply = "Please start a screen sharing session first so I can see your screen.";
      setMessages((prev) => [
        ...prev,
        { role: "user", content: cmd, timestamp: Date.now() },
        { role: "assistant", content: reply, timestamp: Date.now() },
      ]);
      speak(reply);
    }
  }

  // ─── Screen Share ───────────────────────────────────────────────────────────
  async function startScreenShare() {
    setSessionState("requesting");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 5, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;

      // Attach to hidden capture video — always in DOM
      if (captureVideoRef.current) {
        captureVideoRef.current.srcObject = stream;
        await captureVideoRef.current.play();
      }

      // Preview video is not in DOM yet (sidebar only renders when active)
      // useEffect below attaches stream after render

      stream.getVideoTracks()[0].addEventListener("ended", stopSession);
      setSessionState("active");
      const greeting = "Screen connected. I'm your execution agent — I see your screen and produce ready-to-use output. Give me a command like 'write a reply to this email', 'draft an ad for this product', or 'summarize these analytics' and I'll generate the full output instantly.";
      setMessages([{ role: "assistant", content: "👁️ " + greeting, timestamp: Date.now() }]);
      speak(greeting);
    } catch (err) {
      console.error("Screen share error:", err);
      setSessionState("error");
    }
  }

  function stopSession() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    if (captureRef.current) clearInterval(captureRef.current);
    if (captureVideoRef.current) captureVideoRef.current.srcObject = null;
    if (previewVideoRef.current) previewVideoRef.current.srcObject = null;
    stopVoice();
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
    if (!input.trim() || isAnalyzingRef.current) return;
    const msg = input.trim();
    setInput("");
    if (sessionState === "active") {
      if (captureRef.current) {
        clearInterval(captureRef.current);
        captureRef.current = setInterval(() => {
          if (!isAnalyzingRef.current) analyzeFrame();
        }, CAPTURE_INTERVAL_MS);
      }
      await analyzeFrame(msg);
    } else {
      const reply = "Please start a screen sharing session so I can see your screen and give you specific guidance.";
      setMessages((prev) => [
        ...prev,
        { role: "user", content: msg, timestamp: Date.now() },
        { role: "assistant", content: reply, timestamp: Date.now() },
      ]);
    }
  }

  const timerColor = timeLeft > 300 ? "text-emerald-400" : timeLeft > 60 ? "text-amber-400" : "text-red-400";
  const timerBg = timeLeft > 300 ? "bg-emerald-500/10 border-emerald-500/20" : timeLeft > 60 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";
  const isSessionActive = sessionState === "active" || sessionState === "paused" || sessionState === "expired";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <video ref={captureVideoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Header ── */}
      <div className="border-b border-zinc-800 bg-[#0d0d14] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-800/50 flex-shrink-0">
            <ArrowLeft size={13} /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center flex-shrink-0">
            <Monitor size={15} className="text-[#c47d3b]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">AI Marketing Coach</div>
            <div className="text-xs text-zinc-500 hidden sm:block">Screen · Voice · Automation</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {isSessionActive && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-mono font-semibold ${timerBg} ${timerColor}`}>
              <Clock size={11} />{formatTime(timeLeft)}
            </div>
          )}

          {/* Face status pill */}
          {isSessionActive && showFacePanel && (
            <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-medium ${faceData?.faceDetected ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${faceData?.faceDetected ? "bg-cyan-400" : "bg-zinc-600"}`} />
              {faceData?.faceDetected ? `${faceData.expression}${faceData.mouthOpen ? " 🗣" : ""}` : "No Face"}
            </div>
          )}

          {/* Extension status pill */}
          {isSessionActive && (
            <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-medium ${extensionConnected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${extensionConnected ? "bg-emerald-400" : "bg-zinc-600"}`} />
              {extensionConnected ? "Agent Active" : "No Extension"}
            </div>
          )}

          {/* Face panel toggle */}
          {isSessionActive && (
            <button
              onClick={() => setShowFacePanel(v => !v)}
              title="Toggle face analysis"
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${showFacePanel ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}

          {/* TTS toggle */}
          {isSessionActive && (
            <button
              onClick={() => { setTtsEnabled(v => !v); synthRef.current?.cancel(); }}
              title={ttsEnabled ? "Mute AI voice" : "Enable AI voice"}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${ttsEnabled ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}
            >
              {ttsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
          )}

          {/* Auto mode */}
          {sessionState === "active" && (
            <button
              onClick={() => setAutoMode(v => !v)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all ${autoMode ? "bg-[#c47d3b]/10 border-[#c47d3b]/30 text-[#c47d3b]" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}
            >
              <RefreshCw size={10} className={autoMode ? "animate-spin" : ""} style={{ animationDuration: "3s" }} />
              <span className="hidden sm:inline">{autoMode ? "Auto" : "Manual"}</span>
            </button>
          )}

          <Link href="/pricing" className="flex items-center gap-1 bg-[#c47d3b]/10 hover:bg-[#c47d3b]/20 border border-[#c47d3b]/30 text-[#c47d3b] px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors">
            <Crown size={11} /> Pro
          </Link>

          {(sessionState === "idle" || sessionState === "error") && (
            <button onClick={startScreenShare} className="flex items-center gap-1.5 bg-[#c47d3b] hover:bg-[#a66830] text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
              <Monitor size={13} /> <span className="hidden sm:inline">Start</span>
            </button>
          )}
          {sessionState === "requesting" && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs px-3 py-2">
              <Loader2 size={13} className="animate-spin" /> Waiting...
            </div>
          )}
          {(sessionState === "active" || sessionState === "paused") && (
            <div className="flex items-center gap-1.5">
              <button onClick={togglePause} className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors">
                {sessionState === "paused" ? <><Zap size={11} /> Resume</> : <><Clock size={11} /> Pause</>}
              </button>
              <button onClick={stopSession} className="flex items-center gap-1 bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/40 text-zinc-400 hover:text-red-400 px-2.5 py-2 rounded-xl text-xs font-medium transition-all">
                <MonitorOff size={11} /> Stop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Screen preview sidebar */}
        {(sessionState === "active" || sessionState === "paused") && (
          <div className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 border-r border-zinc-800 bg-[#0d0d14] flex-col">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Screen Preview</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${sessionState === "active" ? "bg-red-500 animate-pulse" : "bg-zinc-600"}`} />
                <span className="text-xs text-zinc-600">{sessionState === "active" ? "Live" : "Paused"}</span>
              </div>
            </div>
            <div className="flex-1 p-3 flex items-start justify-center pt-4">
              <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <video
                  ref={(el) => {
                    (previewVideoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                    // Attach stream as soon as this element mounts
                    if (el && streamRef.current && !el.srcObject) {
                      el.srcObject = streamRef.current;
                      el.play().catch(() => {});
                    }
                  }}
                  className="w-full h-auto block"
                  muted
                  playsInline
                />
              </div>
            </div>
            {lastFrameTime && (
              <div className="px-4 py-2 border-t border-zinc-800 text-xs text-zinc-600 text-center">
                Last analyzed {Math.round((Date.now() - lastFrameTime) / 1000)}s ago
              </div>
            )}

            {/* Face analysis panel */}
            {showFacePanel && (
              <WebcamFaceAnalysis
                className="border-t border-zinc-800"
                onFaceData={setFaceData}
              />
            )}

            {/* Extension connection panel */}
            <div className="mx-3 mb-3 bg-[#111118] border border-zinc-800 rounded-xl p-3">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${extensionConnected ? "bg-emerald-400" : "bg-zinc-600"}`} />
                Extension {extensionConnected ? "Connected" : "Not Connected"}
              </div>
              {!extensionConnected ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Extension ID..."
                    defaultValue={extensionId}
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c47d3b] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none"
                    onKeyDown={(e) => { if (e.key === "Enter") testExtension((e.target as HTMLInputElement).value); }}
                    onBlur={(e) => { if (e.target.value.trim()) testExtension(e.target.value); }}
                  />
                  <p className="text-[10px] text-zinc-600 leading-relaxed">
                    Get ID from <strong className="text-zinc-500">chrome://extensions</strong> → BeyonAi Agent → copy the ID shown there.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs text-emerald-400">AI can now execute actions on your active tab automatically.</p>
                  {lastAction && (
                    <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1.5">
                      {lastAction}
                    </div>
                  )}
                  <button
                    onClick={() => { setExtensionConnected(false); setExtensionId(""); }}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            {/* Voice status in sidebar */}
            {voiceState !== "off" && (
              <div className={`mx-3 mb-3 px-4 py-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                voiceState === "listening"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}>
                <Mic size={12} className={voiceState === "listening" ? "animate-pulse" : ""} />
                {voiceState === "listening" ? (voiceTranscript || "Listening...") : "Processing command..."}
              </div>
            )}
          </div>
        )}

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Idle / error */}
          {(sessionState === "idle" || sessionState === "error") && (
            <div className="flex-1 flex items-center justify-center px-4 py-6">
              <div className="max-w-lg w-full text-center">
                {sessionState === "error" && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2 justify-center mb-5">
                    <AlertTriangle size={15} /> Screen share was denied or cancelled. Try again.
                  </div>
                )}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center mx-auto mb-5">
                  <Monitor size={32} className="text-[#c47d3b]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">AI Marketing Coach</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                  Share your screen and give a command. The AI produces the full output — complete emails, ad copy, social posts, form fills — ready to copy and paste instantly.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-6 text-left">
                  {[
                    { icon: "📧", title: "Write Email", desc: "Full draft, ready to send" },
                    { icon: "📢", title: "Write Ad Copy", desc: "All fields, all platforms" },
                    { icon: "�", title: "Write Post", desc: "Caption + hashtags done" },
                    { icon: "📊", title: "Read Analytics", desc: "Summary + action plan" },
                  ].map((f) => (
                    <div key={f.title} className="bg-[#111118] border border-zinc-800 rounded-xl p-3">
                      <div className="text-lg mb-1">{f.icon}</div>
                      <div className="text-xs font-semibold text-white mb-0.5">{f.title}</div>
                      <div className="text-xs text-zinc-500">{f.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400/80 mb-5 flex items-center gap-2 justify-center flex-wrap">
                  <Clock size={12} /> Free: 15 min/session ·{" "}
                  <Link href="/pricing" className="underline hover:text-amber-300">Upgrade for unlimited</Link>
                </div>
                <button onClick={startScreenShare} className="w-full bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Monitor size={18} /> Start AI Coach Session
                </button>
              </div>
            </div>
          )}

          {/* Active chat */}
          {isSessionActive && (
            <>
              {/* Mobile voice status bar */}
              {voiceState !== "off" && (
                <div className={`lg:hidden px-4 py-2 flex items-center gap-2 text-xs font-medium border-b ${
                  voiceState === "listening"
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}>
                  <Mic size={12} className={voiceState === "listening" ? "animate-pulse" : ""} />
                  {voiceState === "listening" ? (voiceTranscript || "Listening for your command...") : "Processing your command..."}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {sessionState === "paused" && (
                  <div className="flex items-center justify-center">
                    <div className="bg-zinc-800/80 border border-zinc-700 rounded-full px-4 py-2 text-xs text-zinc-400 flex items-center gap-2">
                      <Clock size={12} /> Session paused
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
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

              {/* Input bar */}
              <div className="border-t border-zinc-800 bg-[#0d0d14] px-4 py-3 flex-shrink-0">
                <div className="flex gap-2 items-end max-w-3xl mx-auto">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={sessionState === "expired" ? "Session expired — upgrade for more time" : voiceState === "listening" ? "🎙️ Listening..." : "Type a task or command... (Enter to send)"}
                    disabled={sessionState === "expired"}
                    rows={2}
                    className="flex-1 bg-[#111118] border border-zinc-700 focus:border-[#c47d3b] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none transition-colors disabled:opacity-40"
                  />
                  <div className="flex flex-col gap-2">
                    {/* Send */}
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isAnalyzing || sessionState === "expired"}
                      className="w-11 h-11 bg-[#c47d3b] hover:bg-[#a66830] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                    >
                      {isAnalyzing ? <Loader2 size={15} className="animate-spin text-white" /> : <Send size={15} className="text-white" />}
                    </button>

                    {/* Voice button */}
                    {sessionState === "active" && (
                      <button
                        onClick={toggleVoice}
                        title={voiceState !== "off" ? "Stop listening" : "Start voice command"}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${
                          voiceState === "listening"
                            ? "bg-red-500 border-red-400 text-white animate-pulse"
                            : voiceState === "processing"
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        }`}
                      >
                        {voiceState !== "off" ? <MicOff size={15} /> : <Mic size={15} />}
                      </button>
                    )}

                    {/* Manual analyze */}
                    {sessionState === "active" && (
                      <button
                        onClick={() => analyzeFrame()}
                        disabled={isAnalyzing}
                        title="Analyze screen now"
                        className="w-11 h-11 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors"
                      >
                        <RefreshCw size={13} className={`text-zinc-400 ${isAnalyzing ? "animate-spin" : ""}`} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-center text-xs text-zinc-700 mt-2">
                  {sessionState === "active"
                    ? "🎙️ Speak a command · ⌨️ Type a task · output appears ready to copy"
                    : sessionState === "paused"
                    ? "Session paused — resume to continue"
                    : "Upgrade to Pro for unlimited sessions"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
