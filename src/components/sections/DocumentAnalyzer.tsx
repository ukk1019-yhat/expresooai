"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Mail,
  MessageSquare,
  BookOpen,
  X,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Issue {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface Solution {
  issue: string;
  solution: string;
}

interface DocumentReport {
  title: string;
  summary: string;
  score: number;
  issues: Issue[];
  solutions: Solution[];
  recommendations: string[];
}

type SendDestination = "email" | "slack" | "notion";
type AnalysisState = "idle" | "uploading" | "analyzing" | "done" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = ".txt,.md,.csv,.json,.pdf,.docx,.doc";
const MAX_SIZE_MB = 5;

function severityIcon(severity: Issue["severity"]) {
  if (severity === "high")
    return <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />;
  if (severity === "medium")
    return <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />;
  return <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />;
}

function severityBadge(severity: Issue["severity"]) {
  const map = {
    high: "bg-red-500/10 border-red-500/30 text-red-400",
    medium: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    low: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  };
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[severity]}`}
    >
      {severity}
    </span>
  );
}

function scoreColor(score: number) {
  if (score >= 8) return "#22c55e";
  if (score >= 6) return "#c47d3b";
  return "#ef4444";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DropZone({
  onFile,
  isDragging,
  setIsDragging,
}: {
  onFile: (f: File) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile, setIsDragging]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-[#c47d3b] bg-[#c47d3b]/5"
          : "border-zinc-700 hover:border-zinc-500 bg-[#111118] hover:bg-zinc-900/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? "bg-[#c47d3b]/20" : "bg-zinc-800"
          }`}
        >
          <Upload size={28} className={isDragging ? "text-[#c47d3b]" : "text-zinc-400"} />
        </div>
        <div>
          <p className="text-white font-semibold text-lg mb-1">
            {isDragging ? "Drop your document here" : "Upload a document"}
          </p>
          <p className="text-zinc-500 text-sm">
            Drag & drop or click to browse
          </p>
          <p className="text-zinc-600 text-xs mt-2">
            TXT, MD, CSV, JSON, PDF, DOCX · Max {MAX_SIZE_MB}MB
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 104 104">
          <circle cx="52" cy="52" r={radius} fill="none" stroke="#1a1a24" strokeWidth="8" />
          <circle
            cx="52"
            cy="52"
            r={radius}
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
          <span className="text-3xl font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Health Score</span>
    </div>
  );
}

function SendPanel({
  report,
  fileName,
  onClose,
}: {
  report: DocumentReport;
  fileName: string;
  onClose: () => void;
}) {
  const [destination, setDestination] = useState<SendDestination>("email");
  const [emailAddress, setEmailAddress] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [notionApiKey, setNotionApiKey] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  async function handleSend() {
    setSending(true);
    setSendError("");

    try {
      const body: Record<string, unknown> = {
        destination,
        report,
        fileName,
      };

      if (destination === "email") body.emailAddress = emailAddress;
      if (destination === "slack") body.slackWebhookUrl = slackWebhookUrl;
      if (destination === "notion") {
        body.notionApiKey = notionApiKey;
        body.notionDatabaseId = notionDatabaseId;
      }

      const res = await fetch("/api/document/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  const destinations: { id: SendDestination; label: string; icon: React.ReactNode }[] = [
    { id: "email", label: "Email", icon: <Mail size={16} /> },
    { id: "slack", label: "Slack", icon: <MessageSquare size={16} /> },
    { id: "notion", label: "Notion", icon: <BookOpen size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h3 className="text-white font-semibold">Send Report</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-1">Report Sent!</p>
              <p className="text-zinc-400 text-sm">
                Your analysis has been delivered to {destination}.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Destination tabs */}
              <div className="flex gap-2 mb-6">
                {destinations.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDestination(d.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      destination === d.id
                        ? "bg-[#c47d3b] text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
                    }`}
                  >
                    {d.icon}
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Fields */}
              <div className="space-y-4">
                {destination === "email" && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c47d3b] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {destination === "slack" && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                      Slack Webhook URL
                    </label>
                    <input
                      type="url"
                      value={slackWebhookUrl}
                      onChange={(e) => setSlackWebhookUrl(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c47d3b] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-zinc-600 mt-1.5">
                      Create an incoming webhook in your Slack workspace settings.
                    </p>
                  </div>
                )}

                {destination === "notion" && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                        Notion Integration Token
                      </label>
                      <input
                        type="password"
                        value={notionApiKey}
                        onChange={(e) => setNotionApiKey(e.target.value)}
                        placeholder="secret_..."
                        className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c47d3b] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                        Database ID
                      </label>
                      <input
                        type="text"
                        value={notionDatabaseId}
                        onChange={(e) => setNotionDatabaseId(e.target.value)}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c47d3b] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-zinc-600 mt-1.5">
                        The 32-char ID from your Notion database URL. Database must have Name (title), Score (number), and Issues Count (number) properties.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {sendError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  {sendError}
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={
                  sending ||
                  (destination === "email" && !emailAddress) ||
                  (destination === "slack" && !slackWebhookUrl) ||
                  (destination === "notion" && (!notionApiKey || !notionDatabaseId))
                }
                className="mt-6 w-full bg-[#c47d3b] hover:bg-[#a66830] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Report</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DocumentAnalyzer() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [report, setReport] = useState<DocumentReport | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [showSendPanel, setShowSendPanel] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState(true);
  const [expandedSolutions, setExpandedSolutions] = useState(true);

  function handleFile(file: File) {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedFile(file);
    setError("");
    setState("idle");
    setReport(null);
  }

  async function analyzeDocument() {
    if (!selectedFile) return;

    setState("uploading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setState("analyzing");

      const res = await fetch("/api/document/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setReport(data.report);
      setFileName(data.fileName);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setSelectedFile(null);
    setReport(null);
    setError("");
    setFileName("");
  }

  const isLoading = state === "uploading" || state === "analyzing";

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload area */}
      {!report && (
        <div className="space-y-4">
          <DropZone
            onFile={handleFile}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />

          {selectedFile && (
            <div className="bg-[#111118] border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center">
                  <FileText size={16} className="text-[#c47d3b]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                  <p className="text-xs text-zinc-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedFile(null); setError(""); }}
                className="text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={analyzeDocument}
            disabled={!selectedFile || isLoading}
            className="w-full bg-[#c47d3b] hover:bg-[#a66830] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {state === "uploading" ? "Uploading..." : "Analyzing document..."}
              </>
            ) : (
              <>
                <TrendingUp size={18} />
                Analyze Document
              </>
            )}
          </button>
        </div>
      )}

      {/* Report */}
      {report && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  Analysis Complete
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{report.title}</h2>
              <p className="text-zinc-500 text-sm mt-1">{fileName}</p>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/50 flex-shrink-0"
            >
              <RotateCcw size={14} /> New
            </button>
          </div>

          {/* Score + summary */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={report.score} />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Summary
              </h3>
              <p className="text-zinc-200 leading-relaxed text-sm">{report.summary}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
                  {report.issues.length} issues found
                </span>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
                  {report.solutions.length} solutions
                </span>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
                  {report.recommendations.length} recommendations
                </span>
              </div>
            </div>
          </div>

          {/* Issues */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedIssues((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors"
            >
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={14} className="text-red-400" />
                Issues Identified ({report.issues.length})
              </h3>
              {expandedIssues ? (
                <ChevronUp size={16} className="text-zinc-500" />
              ) : (
                <ChevronDown size={16} className="text-zinc-500" />
              )}
            </button>
            {expandedIssues && (
              <div className="px-6 pb-6 space-y-3 border-t border-zinc-800 pt-4">
                {report.issues.map((issue, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-zinc-900/50 rounded-xl p-4"
                  >
                    {severityIcon(issue.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium text-white">{issue.title}</span>
                        {severityBadge(issue.severity)}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solutions */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedSolutions((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors"
            >
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Solutions ({report.solutions.length})
              </h3>
              {expandedSolutions ? (
                <ChevronUp size={16} className="text-zinc-500" />
              ) : (
                <ChevronDown size={16} className="text-zinc-500" />
              )}
            </button>
            {expandedSolutions && (
              <div className="px-6 pb-6 space-y-3 border-t border-zinc-800 pt-4">
                {report.solutions.map((sol, i) => (
                  <div key={i} className="flex items-start gap-3 bg-zinc-900/50 rounded-xl p-4">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-400 text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 mb-1">{sol.issue}</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{sol.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-[#c47d3b]" />
              Recommendations
            </h3>
            <ul className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#c47d3b] text-xs font-bold">
                    {i + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Send CTA */}
          <div className="bg-[#111118] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Share This Report
            </h3>
            <p className="text-zinc-500 text-sm mb-4">
              Send the full analysis to your team via Email, Slack, or Notion.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowSendPanel(true)}
                className="flex items-center justify-center gap-2 bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Mail size={15} /> Send via Email
              </button>
              <button
                onClick={() => setShowSendPanel(true)}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <MessageSquare size={15} /> Send to Slack
              </button>
              <button
                onClick={() => setShowSendPanel(true)}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <BookOpen size={15} /> Save to Notion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send modal */}
      {showSendPanel && report && (
        <SendPanel
          report={report}
          fileName={fileName}
          onClose={() => setShowSendPanel(false)}
        />
      )}
    </div>
  );
}
