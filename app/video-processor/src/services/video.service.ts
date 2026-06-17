/**
 * Video processing service — browser-side using WebCodecs / Canvas API.
 * All heavy lifting is done client-side to avoid server resource limits.
 *
 * Strategy:
 *  1. For each clip, extract the first `durationSec` seconds of video as frames via
 *     HTMLVideoElement + OffscreenCanvas (or regular Canvas).
 *  2. Write frames into a MediaRecorder-backed output stream.
 *  3. Concatenate all encoded segments and return a Blob URL.
 *
 * This is deliberately a progressive-enhancement approach:
 *  - Uses MediaRecorder (widely supported)
 *  - Falls back gracefully when clips are short
 */

export type ClipItem = {
  id: string;
  file: File;
  durationSec: number; // how many seconds to use from this clip
  name: string;
  objectUrl: string;
};

export type ProcessingProgress = {
  stage: "preparing" | "encoding" | "merging" | "done" | "error";
  progress: number; // 0–100
  message: string;
};

type ProgressCallback = (progress: ProcessingProgress) => void;

const TARGET_WIDTH = 1080;
const TARGET_HEIGHT = 1920;
const VIDEO_FPS = 30;
const VIDEO_BITRATE = 5_000_000; // 5 Mbps

function getVideoMimeType(): string {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "video/webm";
}

async function extractFrames(
  file: File,
  durationSec: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  onFrame: () => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.addEventListener("loadedmetadata", async () => {
      const clipActualDuration = video.duration;
      const useDuration = Math.min(durationSec, clipActualDuration);
      const totalFrames = Math.ceil(useDuration * VIDEO_FPS);
      const frameInterval = useDuration / totalFrames;

      // Draw each frame at precise seek points
      let frameIndex = 0;

      const drawNextFrame = () => {
        if (frameIndex >= totalFrames) {
          URL.revokeObjectURL(url);
          resolve();
          return;
        }
        const seekTime = frameIndex * frameInterval;
        video.currentTime = Math.min(seekTime, clipActualDuration - 0.001);
      };

      video.addEventListener("seeked", () => {
        // Draw video frame onto canvas maintaining aspect ratio with cover behavior
        const vw = video.videoWidth || TARGET_WIDTH;
        const vh = video.videoHeight || TARGET_HEIGHT;
        const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;
        const videoAspect = vw / vh;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        let drawW: number;
        let drawH: number;
        let drawX: number;
        let drawY: number;

        if (videoAspect > targetAspect) {
          // wider than target — letterbox sides
          drawH = TARGET_HEIGHT;
          drawW = drawH * videoAspect;
          drawX = (TARGET_WIDTH - drawW) / 2;
          drawY = 0;
        } else {
          // taller than target — letterbox top/bottom
          drawW = TARGET_WIDTH;
          drawH = drawW / videoAspect;
          drawX = 0;
          drawY = (TARGET_HEIGHT - drawH) / 2;
        }

        ctx.drawImage(video, drawX, drawY, drawW, drawH);
        onFrame();
        frameIndex++;
        drawNextFrame();
      });

      // Start
      video.load();
      drawNextFrame();
    });

    video.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load video: ${file.name}`));
    });

    video.load();
  });
}

export async function processClips(
  clips: ClipItem[],
  onProgress: ProgressCallback,
): Promise<Blob> {
  if (clips.length === 0) {
    throw new Error("No clips to process");
  }

  const mimeType = getVideoMimeType();
  const canvas = document.createElement("canvas");
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  // Set up MediaRecorder on the canvas stream
  const stream = canvas.captureStream(VIDEO_FPS);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: VIDEO_BITRATE,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start(100); // collect in 100ms chunks

  const totalFrames = clips.reduce(
    (sum, clip) => sum + Math.ceil(clip.durationSec * VIDEO_FPS),
    0,
  );
  let processedFrames = 0;

  onProgress({
    stage: "encoding",
    progress: 0,
    message: "Starting video encoding...",
  });

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    onProgress({
      stage: "encoding",
      progress: Math.round((processedFrames / totalFrames) * 85),
      message: `Encoding clip ${i + 1} of ${clips.length}...`,
    });

    try {
      await extractFrames(clip.file, clip.durationSec, canvas, ctx, () => {
        processedFrames++;
      });
    } catch (err) {
      console.warn(`Skipping clip ${clip.name}:`, err);
    }

    // Brief pause between clips for transition frames
    await new Promise((r) => setTimeout(r, 50));
  }

  onProgress({
    stage: "merging",
    progress: 90,
    message: "Finalizing video...",
  });

  // Stop recording and wait for all data
  await new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
    recorder.stop();
  });

  onProgress({
    stage: "done",
    progress: 100,
    message: "Video ready!",
  });

  return new Blob(chunks, { type: mimeType });
}
