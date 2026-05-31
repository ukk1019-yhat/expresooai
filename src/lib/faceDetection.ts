import type * as FaceApi from "@vladmandic/face-api";

let faceapi: typeof FaceApi | null = null;
let modelsLoaded = false;
let loadPromise: Promise<void> | null = null;
export let loadStage = "idle";
export let loadProgress = 0;
const listeners = new Set<() => void>();

const MODEL_PATH = "/models/face-api";

function notify() {
  listeners.forEach((fn) => fn());
}

export function onLoadChange(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

async function getFaceApi(): Promise<typeof FaceApi> {
  if (!faceapi) {
    loadStage = "loading-library";
    notify();
    faceapi = await import("@vladmandic/face-api");
    loadStage = "library-loaded";
    loadProgress = 10;
    notify();
  }
  return faceapi;
}

export type FaceDetectionResult = {
  detection: { box: { x: number; y: number; width: number; height: number }; score: number };
  landmarks: { positions: { x: number; y: number }[]; getMouth(): { x: number; y: number }[] };
  expressions: ({ asSortedArray(): { expression: string; probability: number }[] } & { [expr: string]: number }) | null;
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

// ─── Built-in Shape Detection API (Chrome/Edge) ──────────────────────────
function isFaceDetectorSupported(): boolean {
  return typeof (globalThis as any).FaceDetector !== "undefined";
}

async function detectWithBuiltin(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<FaceDetectionResult[]> {
  if (!isFaceDetectorSupported()) return [];

  const FaceDetectorCtor = (globalThis as any).FaceDetector;
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

  return faces.map((face: any) => {
    const b = face.boundingBox;
    const box = { x: b.x || b.left || 0, y: b.y || b.top || 0, width: b.width || 0, height: b.height || 0 };

    // landmarks from FaceDetector API: eyes, nose, mouth
    const lm = face.landmarks || [];
    const positions: { x: number; y: number }[] = lm.map((l: any) => ({
      x: l.locations?.[0]?.x ?? 0,
      y: l.locations?.[0]?.y ?? 0,
    }));

    let mouthAspectRatio = 0;
    let mouthOpen = false;

    // Try to compute mouth aspect ratio from built-in landmarks
    if (positions.length >= 2) {
      // Find mouth landmarks (usually index for left mouth, right mouth)
      const mouthPoints = lm.filter((l: any) => l.type === "mouth").flatMap((l: any) => l.locations || []);
      if (mouthPoints.length >= 2) {
        const xs = mouthPoints.map((p: any) => p.x);
        const ys = mouthPoints.map((p: any) => p.y);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const w = maxX - minX;
        const h = maxY - minY;
        mouthAspectRatio = w > 0 ? h / w : 0;
        mouthOpen = mouthAspectRatio > 0.4;
      }
    }

    return {
      detection: { box, score: 0.9 },
      landmarks: {
        positions,
        getMouth: () => positions.slice(-2),
      },
      expressions: null,
      mouthOpen,
      mouthAspectRatio,
    };
  });
}

// ─── face-api.js fallback ────────────────────────────────────────────────
async function getFaceApiModule(): Promise<typeof FaceApi> {
  return getFaceApi();
}

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  if (loadPromise) return loadPromise;

  // Skip if built-in API is available
  if (isFaceDetectorSupported()) {
    modelsLoaded = true;
    loadStage = "ready";
    loadProgress = 100;
    notify();
    return;
  }

  loadPromise = (async () => {
    try {
      const api = await getFaceApiModule();

      loadStage = "loading-tiny-face-detector";
      loadProgress = 15;
      notify();
      await api.nets.tinyFaceDetector.loadFromUri(MODEL_PATH);

      loadStage = "loading-face-landmarks";
      loadProgress = 45;
      notify();
      await api.nets.faceLandmark68Net.loadFromUri(MODEL_PATH);

      loadStage = "loading-face-expressions";
      loadProgress = 75;
      notify();
      await api.nets.faceExpressionNet.loadFromUri(MODEL_PATH);

      modelsLoaded = true;
      loadStage = "ready";
      loadProgress = 100;
    } catch (err) {
      loadPromise = null;
      loadStage = "error";
      throw new Error(`Failed to load face models: ${err}`);
    } finally {
      notify();
    }
  })();

  return loadPromise;
}

export function startPreloadModels(): void {
  if (!loadPromise && !modelsLoaded) {
    loadFaceModels().catch(() => {});
  }
}

export function getLoadState(): FaceDetectionState {
  return {
    loaded: modelsLoaded || false,
    loading: !!loadPromise && !modelsLoaded,
    stage: loadStage,
    progress: loadProgress,
    error: null,
  };
}

function computeMouthAspectRatio(landmarks: FaceApi.FaceLandmarks68): { mouthOpen: boolean; mouthAspectRatio: number } {
  const mouth = landmarks.getMouth();
  if (mouth.length < 20) return { mouthOpen: false, mouthAspectRatio: 0 };

  let minY = Infinity, maxY = -Infinity;
  let minX = Infinity, maxX = -Infinity;
  for (const p of mouth) {
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }
  const height = maxY - minY;
  const width = maxX - minX;
  const mar = width > 0 ? height / width : 0;
  return { mouthOpen: mar > 0.45, mouthAspectRatio: mar };
}

// ─── Detection orchestration ─────────────────────────────────────────────

export async function detectAllFaces(
  input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<FaceDetectionResult[]> {
  // Try built-in API first
  if (isFaceDetectorSupported()) {
    const results = await detectWithBuiltin(input);
    if (results.length > 0) return results;
  }

  // Fallback to face-api
  if (!modelsLoaded) return [];
  const api = await getFaceApi();

  try {
    const results = await api
      .detectAllFaces(input, new api.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions();

    return results.map((result) => {
      const { mouthOpen, mouthAspectRatio } = computeMouthAspectRatio(result.landmarks);
      return {
        detection: {
          box: { x: result.detection.box.x, y: result.detection.box.y, width: result.detection.box.width, height: result.detection.box.height },
          score: result.detection.score,
        },
        landmarks: {
          positions: result.landmarks.positions.map((p) => ({ x: p.x, y: p.y })),
          getMouth: () => result.landmarks.getMouth().map((p) => ({ x: p.x, y: p.y })),
        },
        expressions: result.expressions as any,
        mouthOpen,
        mouthAspectRatio,
      };
    });
  } catch {
    return [];
  }
}

export function getDominantExpression(expressions: FaceDetectionResult["expressions"]): {
  expression: string;
  probability: number;
} {
  if (!expressions || typeof expressions.asSortedArray !== "function") {
    return { expression: "unknown", probability: 0 };
  }
  const sorted = expressions.asSortedArray();
  return { expression: sorted[0].expression, probability: sorted[0].probability };
}

export function drawFaceOverlay(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  results: FaceDetectionResult[]
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = video.videoWidth || video.width;
  canvas.height = video.videoHeight || video.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const result of results) {
    const box = result.detection.box;
    const { expression, probability } = getDominantExpression(result.expressions);

    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    const label = expression !== "unknown"
      ? `${expression} (${(probability * 100).toFixed(0)}%)`
      : "Face detected";
    ctx.fillStyle = "#22d3ee";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(label, box.x, box.y - 6);

    if (result.mouthOpen) {
      ctx.fillStyle = "rgba(251, 191, 36, 0.3)";
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      const mouth = result.landmarks.getMouth();
      ctx.beginPath();
      for (let i = 0; i < mouth.length; i++) {
        const p = mouth[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    for (const point of result.landmarks.positions) {
      ctx.fillStyle = "rgba(34, 211, 238, 0.6)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
