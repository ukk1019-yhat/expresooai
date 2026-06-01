"use client";

export type FaceDetectionResult = {
  detection: { box: { x: number; y: number; width: number; height: number }; score: number };
  landmarks: { positions: { x: number; y: number }[] };
  expressions: null;
  mouthOpen: boolean;
  mouthAspectRatio: number;
};

export type FaceDetectionState = {
  loaded: boolean;
  loading: boolean;
  stage: string;
  progress: number;
  error: string | null;
};

const listeners = new Set<() => void>();
let state: FaceDetectionState = { loaded: false, loading: false, stage: "checking", progress: 0, error: null };

function notify() {
  listeners.forEach((fn) => fn());
}

export function onLoadChange(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function isFaceDetectorSupported(): boolean {
  return typeof (globalThis as any).FaceDetector !== "undefined";
}

export async function loadFaceModels(): Promise<void> {
  if (state.loaded || state.loading) return;

  state = { ...state, loading: true, stage: "checking", progress: 10 };
  notify();

  // Small delay so the UI can paint the loading state before synchronous detection check
  await new Promise((r) => setTimeout(r, 100));

  if (isFaceDetectorSupported()) {
    state = { loaded: true, loading: false, stage: "ready", progress: 100, error: null };
    notify();
    return;
  }

  state = {
    loaded: false,
    loading: false,
    stage: "error",
    progress: 100,
    error: "Your browser does not support the Face Detection API. Please use Chrome or Edge.",
  };
  notify();
}

export function startPreloadModels(): void {
  loadFaceModels().catch(() => {});
}

export function getLoadState(): FaceDetectionState {
  return { ...state };
}

async function detectWithBuiltin(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<FaceDetectionResult[]> {
  const FaceDetectorCtor = (window as any).FaceDetector;
  if (!FaceDetectorCtor) return [];

  // Detect faces using the fastest settings
  const fd = new FaceDetectorCtor({
    maxDetectedFaces: 3,
    fastMode: true,
  });

  let faces: any[];
  try {
    faces = await fd.detect(input);
  } catch {
    return [];
  }

  if (!faces || faces.length === 0) return [];

  const results: FaceDetectionResult[] = [];

  for (const face of faces) {
    const b = face.boundingBox;
    const box = {
      x: b.x ?? b.left ?? 0,
      y: b.y ?? b.top ?? 0,
      width: b.width ?? 0,
      height: b.height ?? 0,
    };

    const landmarks = face.landmarks || [];
    const positions: { x: number; y: number }[] = [];

    // Collect landmark positions
    for (const lm of landmarks) {
      const locs = lm.locations || [];
      for (const loc of locs) {
        positions.push({ x: loc.x ?? 0, y: loc.y ?? 0 });
      }
    }

    // Estimate mouth openness from landmark positions
    let mouthOpen = false;
    let mouthAspectRatio = 0;

    if (positions.length >= 4) {
      // Use vertical spread of mouth landmarks
      const mouthPoints = landmarks
        .filter((l: any) => l.type === "mouth")
        .flatMap((l: any) => l.locations || []);

      if (mouthPoints.length >= 2) {
        const xs = mouthPoints.map((p: any) => p.x);
        const ys = mouthPoints.map((p: any) => p.y);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const w = maxX - minX || 1;
        const h = maxY - minY;
        mouthAspectRatio = h / w;
        mouthOpen = mouthAspectRatio > 0.35;
      }
    }

    results.push({
      detection: { box, score: 0.9 },
      landmarks: { positions },
      expressions: null,
      mouthOpen,
      mouthAspectRatio,
    });
  }

  return results;
}

export async function detectAllFaces(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<FaceDetectionResult[]> {
  return detectWithBuiltin(input);
}

export function getDominantExpression(): { expression: string; probability: number } {
  return { expression: "unknown", probability: 0 };
}

export function drawFaceOverlay(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  results: FaceDetectionResult[]
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = video.videoWidth || video.width || 640;
  canvas.height = video.videoHeight || video.height || 480;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const result of results) {
    const box = result.detection.box;

    // Face bounding box
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Face label
    ctx.fillStyle = "#22d3ee";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("Face detected", box.x, box.y - 6);

    // Mouth open indicator
    if (result.mouthOpen) {
      ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(box.x + box.width / 2, box.y + box.height * 0.7, box.width * 0.15, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    // Landmark points
    for (const point of result.landmarks.positions) {
      ctx.fillStyle = "rgba(34, 211, 238, 0.6)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
