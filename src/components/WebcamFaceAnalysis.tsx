"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera, CameraOff, Loader2, AlertTriangle,
} from "lucide-react";
import { useFaceDetection } from "@/hooks/useFaceDetection";

type WebcamFaceAnalysisProps = {
  className?: string;
  onFaceData?: (data: {
    faceDetected: boolean;
    expression: string;
    expressionProb: number;
    mouthOpen: boolean;
    mouthAspectRatio: number;
  }) => void;
};

export default function WebcamFaceAnalysis({ className = "", onFaceData }: WebcamFaceAnalysisProps) {
  const [webcamOn, setWebcamOn] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const {
    videoRef,
    canvasRef,
    modelState,
    loadModels,
    startWebcam,
    stopWebcam,
    webcamActive,
    faceDetected,
    mouthOpen,
    mouthAspectRatio,
  } = useFaceDetection({ enabled: webcamOn, intervalMs: 250 });

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (onFaceData) {
      onFaceData({ faceDetected, expression: "", expressionProb: 0, mouthOpen, mouthAspectRatio });
    }
  }, [faceDetected, mouthOpen, mouthAspectRatio, onFaceData]);

  const handleStartWebcam = useCallback(async () => {
    setInitError(null);
    const el = document.createElement("video");
    el.muted = true;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    el.style.display = "none";
    document.body.appendChild(el);
    try {
      await startWebcam(el);
      setWebcamOn(true);
    } catch (err) {
      document.body.removeChild(el);
      setInitError(err instanceof Error ? err.message : String(err));
    }
  }, [startWebcam]);

  const toggleWebcam = useCallback(() => {
    if (webcamOn) {
      stopWebcam();
      setWebcamOn(false);
    } else {
      handleStartWebcam();
    }
  }, [webcamOn, stopWebcam, handleStartWebcam]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Face Analysis
        </span>
        <button
          onClick={toggleWebcam}
          disabled={!modelState.loaded && !modelState.loading}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            webcamOn
              ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-[#c47d3b]/10 border border-[#c47d3b]/30 text-[#c47d3b] hover:bg-[#c47d3b]/20"
          }`}
        >
          {modelState.loading ? (
            <Loader2 size={11} className="animate-spin" />
          ) : webcamOn ? (
            <CameraOff size={11} />
          ) : (
            <Camera size={11} />
          )}
          {modelState.loading ? "Loading..." : webcamOn ? "Stop" : "Webcam"}
        </button>
      </div>

      <div className="flex-1 p-3 flex flex-col items-center justify-start pt-4 gap-3">
        {modelState.loading && (
          <div className="flex flex-col items-center gap-2 py-4 w-full">
            <Loader2 size={20} className="animate-spin text-[#c47d3b]" />
            <p className="text-xs text-zinc-500">Checking browser support...</p>
          </div>
        )}

        {modelState.error && !webcamOn && (
          <div className="flex flex-col items-center gap-2 py-6 px-3 text-center">
            <AlertTriangle size={20} className="text-red-400" />
            <p className="text-xs text-red-400">{modelState.error}</p>
          </div>
        )}

        {modelState.loaded && !webcamOn && !initError && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Camera size={28} className="text-zinc-600" />
            <p className="text-xs text-zinc-500 text-center">
              Ready. Turn on your webcam for<br />real-time face analysis
            </p>
          </div>
        )}

        {initError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-xs text-red-400 text-center w-full">
            {initError}
          </div>
        )}

        <div className={`relative w-full max-w-xs ${webcamActive ? "" : "hidden"}`}>
          <video
            ref={(el) => {
              if (el && webcamActive && videoRef.current) {
                if (!el.srcObject) {
                  el.srcObject = (videoRef.current as HTMLVideoElement).srcObject;
                  el.play().catch(() => {});
                }
              }
            }}
            className="w-full h-auto rounded-lg border border-zinc-700 bg-black"
            muted
            playsInline
          />
          <canvas
            ref={(el) => { canvasRef.current = el; }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>

        {webcamActive && (
          <div className="w-full max-w-xs space-y-2">
            <div className="bg-[#111118] border border-zinc-800 rounded-xl px-3 py-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Face</span>
                <span className={`text-xs font-semibold ${faceDetected ? "text-emerald-400" : "text-zinc-600"}`}>
                  {faceDetected ? "Detected" : "None"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Mouth</span>
                <span className={`text-xs font-semibold ${mouthOpen ? "text-amber-400" : "text-zinc-500"}`}>
                  {mouthOpen ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">MAR</span>
                <span className="text-xs font-mono text-zinc-400">
                  {mouthAspectRatio.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
