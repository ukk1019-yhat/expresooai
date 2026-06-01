"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  loadFaceModels,
  detectAllFaces,
  drawFaceOverlay,
  getLoadState,
  startPreloadModels,
  onLoadChange,
  getDominantExpression,
  type FaceDetectionResult,
} from "@/lib/faceDetection";

type UseFaceDetectionOptions = {
  enabled?: boolean;
  intervalMs?: number;
};

export function useFaceDetection({ enabled = true, intervalMs = 200 }: UseFaceDetectionOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastRunRef = useRef<number>(0);

  const [modelState, setModelState] = useState(getLoadState());
  const [webcamActive, setWebcamActive] = useState(false);
  const [results, setResults] = useState<FaceDetectionResult[]>([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [dominantExpression, setDominantExpression] = useState<string>("");
  const [expressionProb, setExpressionProb] = useState<number>(0);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [mouthAspectRatio, setMouthAspectRatio] = useState(0);

  useEffect(() => {
    const unsub = onLoadChange(() => {
      setModelState(getLoadState());
    });
    return () => { unsub(); };
  }, []);

  const loadModels = useCallback(async () => {
    const s = getLoadState();
    if (s.loaded || s.loading) return;
    try {
      await loadFaceModels();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setModelState({ loaded: false, loading: false, stage: "error", progress: 0, error: msg });
    }
  }, []);

  const startWebcam = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      videoElement.srcObject = stream;
      await videoElement.play();
      streamRef.current = stream;
      videoRef.current = videoElement;
      setWebcamActive(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Webcam access denied: ${msg}`);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    videoRef.current = null;
    canvasRef.current = null;
    setWebcamActive(false);
    setResults([]);
    setFaceDetected(false);
  }, []);

  const runDetection = useCallback(
    async (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
      const now = Date.now();
      if (now - lastRunRef.current < intervalMs) return;
      lastRunRef.current = now;

      try {
        const detections = await detectAllFaces(video);
        setResults(detections);
        setFaceDetected(detections.length > 0);

        if (detections.length > 0) {
          setMouthOpen(detections[0].mouthOpen);
          setMouthAspectRatio(detections[0].mouthAspectRatio);
        } else {
          setMouthOpen(false);
          setMouthAspectRatio(0);
        }

        drawFaceOverlay(canvas, video, detections);
      } catch {
        // skip failed frame
      }
    },
    [intervalMs]
  );

  const startDetection = useCallback(
    (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
      lastRunRef.current = Date.now();
      const loop = () => {
        runDetection(canvas, video);
        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    },
    [runDetection]
  );

  useEffect(() => {
    if (modelState.loaded && webcamActive && videoRef.current && canvasRef.current) {
      startDetection(canvasRef.current, videoRef.current);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      }
    };
  }, [modelState.loaded, webcamActive, startDetection]);

  useEffect(() => {
    if (!enabled) {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [enabled, stopWebcam]);

  return {
    videoRef,
    canvasRef,
    modelState,
    loadModels,
    startWebcam,
    stopWebcam,
    webcamActive,
    results,
    faceDetected,
    dominantExpression,
    expressionProb,
    mouthOpen,
    mouthAspectRatio,
  };
}
