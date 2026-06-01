"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Camera, CameraOff, Loader2,
  AlertTriangle, RefreshCw, Smile, Brain,
} from "lucide-react";
import {
  loadFaceModels,
  detectAllFaces,
  drawFaceOverlay,
  onLoadChange,
  getLoadState,
  type FaceDetectionResult,
} from "@/lib/faceDetection";

export default function FaceAnalysisPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);

  const [modelState, setModelState] = useState(getLoadState());
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [results, setResults] = useState<FaceDetectionResult[]>([]);

  useEffect(() => {
    const unsub = onLoadChange(() => {
      setModelState(getLoadState());
    });
    loadFaceModels().catch(() => {});
    return () => { unsub(); };
  }, []);

  const startWebcam = useCallback(async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setWebcamActive(true);
    } catch (err) {
      setWebcamError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setWebcamActive(false);
    setResults([]);
  }, []);

  useEffect(() => {
    if (!webcamActive || !modelState.loaded || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    let lastRun = 0;

    const loop = () => {
      const now = Date.now();
      if (now - lastRun > 200) {
        lastRun = now;
        detectAllFaces(video)
          .then((detections) => {
            setResults(detections);
            drawFaceOverlay(canvas, video, detections);
          })
          .catch(() => {});
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [webcamActive, modelState.loaded]);

  const toggleWebcam = () => {
    if (webcamActive) stopWebcam();
    else startWebcam();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <div className="border-b border-zinc-800 bg-[#0d0d14] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-800/50 flex-shrink-0">
            <ArrowLeft size={13} /> <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-[#c47d3b]/10 border border-[#c47d3b]/20 flex items-center justify-center flex-shrink-0">
            <Brain size={15} className="text-[#c47d3b]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Face Analysis</div>
            <div className="text-xs text-zinc-500">Detection &bull; Lip Sync</div>
          </div>
        </div>
        <button
          onClick={toggleWebcam}
          disabled={!modelState.loaded && !modelState.loading}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            webcamActive
              ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-[#c47d3b]/10 border border-[#c47d3b]/30 text-[#c47d3b] hover:bg-[#c47d3b]/20"
          }`}
        >
          {modelState.loading ? <Loader2 size={13} className="animate-spin" /> : webcamActive ? <CameraOff size={13} /> : <Camera size={13} />}
          {modelState.loading ? "Loading..." : webcamActive ? "Stop Webcam" : "Start Webcam"}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-start p-6 gap-6">
          {modelState.loading && (
            <div className="flex flex-col items-center gap-4 py-16">
              <Loader2 size={32} className="animate-spin text-[#c47d3b]" />
              <p className="text-sm text-zinc-500">Checking browser support...</p>
            </div>
          )}

          {modelState.error && (
            <div className="flex flex-col items-center gap-3 py-12">
              <AlertTriangle size={28} className="text-red-400" />
              <p className="text-sm text-red-400">{modelState.error}</p>
              <p className="text-xs text-zinc-500 max-w-md text-center">Try using Google Chrome or Microsoft Edge.</p>
            </div>
          )}

          {webcamError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle size={15} /> {webcamError}
            </div>
          )}

          {modelState.loaded && !webcamActive && !webcamError && (
            <div className="flex flex-col items-center gap-4 py-16">
              <Camera size={48} className="text-zinc-700" />
              <h2 className="text-lg font-semibold text-white">Webcam Face Analysis</h2>
              <p className="text-sm text-zinc-500 max-w-md text-center">
                Turn on your webcam to see real-time face detection and lip movement tracking.
              </p>
              <button onClick={startWebcam} className="bg-[#c47d3b] hover:bg-[#a66830] text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm">
                <Camera size={16} /> Start Webcam
              </button>
            </div>
          )}

          {webcamActive && (
            <div className="relative w-full max-w-xl mx-auto">
              <video
                ref={videoRef}
                className="w-full h-auto rounded-xl border border-zinc-700 bg-black"
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            </div>
          )}

          {webcamActive && results.length > 0 && (
            <div className="w-full max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard icon={Brain} label="Face" value={`${results.length} detected`} color="text-emerald-400" />
              <MetricCard icon={Smile} label="Expression" value="detected" color="text-cyan-400" />
              <MetricCard
                icon={results[0].mouthOpen ? Camera : CameraOff}
                label="Mouth"
                value={results[0].mouthOpen ? "Open" : "Closed"}
                color={results[0].mouthOpen ? "text-amber-400" : "text-zinc-400"}
              />
              <MetricCard icon={Brain} label="MAR" value={results[0].mouthAspectRatio.toFixed(3)} color="text-purple-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Smile;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#111118] border border-zinc-800 rounded-xl p-3 text-center">
      <Icon size={18} className={`mx-auto mb-1 ${color}`} />
      <div className="text-xs text-zinc-500 mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${color}`}>{value}</div>
    </div>
  );
}
