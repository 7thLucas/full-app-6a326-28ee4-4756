import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Trash2, Plus } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import type { ClipItem, ProcessingProgress } from "~/video-processor/src/services/video.service";
import { UploadZone } from "~/components/UploadZone";
import { ClipCard } from "~/components/ClipCard";
import { DurationControl } from "~/components/DurationControl";
import { GradientButton } from "~/components/GradientButton";
import { ProcessingOverlay } from "~/components/ProcessingOverlay";
import { ResultPlayer } from "~/components/ResultPlayer";
import { FeatureCard } from "~/components/FeatureCard";

type AppStage = "upload" | "processing" | "done" | "error";

let clipIdCounter = 0;
function makeClipId() {
  return `clip-${++clipIdCounter}-${Date.now()}`;
}

export default function IndexPage() {
  const { config, loading } = useConfigurables();

  const appName = config?.appName ?? "Magic Video";
  const tagline = config?.tagline ?? "Turn your clips into magic.";
  const heroHeading = config?.heroHeading ?? "Create Stunning Videos in Seconds";
  const heroSubheading =
    config?.heroSubheading ??
    "Upload your clips, set the duration, and let Magic Video do the rest.";
  const ctaLabel = config?.ctaLabel ?? "Create My Video";
  const uploadAreaLabel =
    config?.uploadAreaLabel ?? "Drop your video clips here, or click to browse";
  const defaultSec = config?.defaultSecondsPerClip ?? 2;
  const maxClips = config?.maxClips ?? 30;
  const features = config?.features ?? [];
  const footerText = config?.footerText ?? "";

  const [clips, setClips] = useState<ClipItem[]>([]);
  const [secondsPerClip, setSecondsPerClip] = useState(defaultSec);
  const [stage, setStage] = useState<AppStage>("upload");
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: "preparing",
    progress: 0,
    message: "Preparing...",
  });
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  // Update seconds per clip when config loads
  useEffect(() => {
    if (!loading && config?.defaultSecondsPerClip) {
      setSecondsPerClip(config.defaultSecondsPerClip);
    }
  }, [loading, config?.defaultSecondsPerClip]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFiles = useCallback(
    (files: File[]) => {
      const newClips: ClipItem[] = [];

      for (const file of files) {
        if (clips.length + newClips.length >= maxClips) break;
        const objectUrl = URL.createObjectURL(file);
        objectUrlsRef.current.push(objectUrl);
        newClips.push({
          id: makeClipId(),
          file,
          durationSec: secondsPerClip,
          name: file.name,
          objectUrl,
        });
      }

      setClips((prev) => [...prev, ...newClips]);
    },
    [clips.length, maxClips, secondsPerClip],
  );

  const handleRemoveClip = useCallback((id: string) => {
    setClips((prev) => {
      const removed = prev.find((c) => c.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.objectUrl);
        objectUrlsRef.current = objectUrlsRef.current.filter(
          (u) => u !== removed.objectUrl,
        );
      }
      return prev.filter((c) => c.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    clips.forEach((c) => {
      URL.revokeObjectURL(c.objectUrl);
    });
    objectUrlsRef.current = [];
    setClips([]);
  }, [clips]);

  const handleProcess = useCallback(async () => {
    if (clips.length === 0) return;

    setStage("processing");
    setProgress({ stage: "preparing", progress: 0, message: "Preparing clips..." });

    try {
      // Dynamic import to keep the bundle lean
      const { processClips } = await import(
        "~/video-processor/src/services/video.service"
      );

      const clipsToProcess = clips.map((c) => ({
        ...c,
        durationSec: secondsPerClip,
      }));

      const resultBlob = await processClips(clipsToProcess, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      setStage("done");
    } catch (err) {
      console.error("Processing failed:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Video processing failed. Please try again.",
      );
      setStage("error");
    }
  }, [clips, secondsPerClip]);

  const handleReset = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setClips([]);
    setStage("upload");
    setErrorMessage(null);
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
  }, [resultUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F9FAFB] font-['Inter',sans-serif]">
      {/* Processing overlay */}
      {stage === "processing" && <ProcessingOverlay progress={progress} />}

      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-40 border-b border-[#1F1F2E] bg-[#0A0A0F]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">{appName}</span>
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-gray-600 hidden sm:block">
            {tagline}
          </span>
        </div>
      </header>

      <main>
        {/* ─── Hero ─── */}
        <section className="py-16 sm:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              For TikTok & Reels creators
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {heroHeading}
              </span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
              {heroSubheading}
            </p>

            {clips.length === 0 && (
              <GradientButton
                size="lg"
                onClick={() => {
                  document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Sparkles className="w-5 h-5" />
                {ctaLabel}
              </GradientButton>
            )}
          </div>
        </section>

        {/* ─── Studio ─── */}
        <section id="studio" className="py-12 px-6">
          <div className="max-w-6xl mx-auto">

            {stage === "done" && resultUrl ? (
              <ResultPlayer
                blobUrl={resultUrl}
                appName={appName}
                onReset={handleReset}
              />
            ) : stage === "error" ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">!</span>
                </div>
                <p className="text-gray-300 font-semibold">Processing Failed</p>
                <p className="text-sm text-gray-500 max-w-md">{errorMessage}</p>
                <GradientButton onClick={handleReset} size="sm">
                  Try Again
                </GradientButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                {/* Left — upload + clip grid */}
                <div className="space-y-6">
                  {/* Upload zone */}
                  <UploadZone
                    onFiles={handleFiles}
                    uploadAreaLabel={uploadAreaLabel}
                    disabled={clips.length >= maxClips}
                  />

                  {/* Clip grid */}
                  {clips.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-400">
                          {clips.length} clip{clips.length !== 1 ? "s" : ""} added
                          {clips.length >= maxClips && (
                            <span className="ml-2 text-xs text-amber-400">(max reached)</span>
                          )}
                        </p>
                        <button
                          onClick={handleClearAll}
                          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors duration-150"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear all
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {clips.map((clip, i) => (
                          <ClipCard
                            key={clip.id}
                            clip={clip}
                            index={i}
                            onRemove={handleRemoveClip}
                          />
                        ))}

                        {/* Add more tile */}
                        {clips.length < maxClips && (
                          <button
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>(
                                'input[type="file"]',
                              );
                              input?.click();
                            }}
                            className="flex flex-col items-center justify-center gap-2 aspect-[9/16]
                              rounded-xl border-2 border-dashed border-[#1F1F2E]
                              text-gray-600 hover:text-purple-400 hover:border-purple-500/40
                              transition-all duration-150 cursor-pointer text-xs font-medium"
                          >
                            <Plus className="w-5 h-5" />
                            Add more
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right — controls */}
                <div className="space-y-5">
                  <DurationControl
                    secondsPerClip={secondsPerClip}
                    clipCount={clips.length}
                    onChange={setSecondsPerClip}
                  />

                  <GradientButton
                    size="lg"
                    className="w-full"
                    onClick={handleProcess}
                    disabled={clips.length === 0}
                    loading={stage === "processing"}
                  >
                    <Sparkles className="w-5 h-5" />
                    {clips.length === 0
                      ? "Upload clips to begin"
                      : `Create Video from ${clips.length} Clip${clips.length !== 1 ? "s" : ""}`}
                  </GradientButton>

                  {clips.length > 0 && (
                    <p className="text-xs text-gray-600 text-center leading-relaxed">
                      Your browser will process the video locally.
                      No upload to any server required.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── Features ─── */}
        {features.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                  Why Magic Video
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Everything you need,{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    nothing you don't
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, i) => (
                  <FeatureCard key={i} feature={feature} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── How it works ─── */}
        <section className="py-20 px-6 border-t border-[#1F1F2E]">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Three steps to a{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  polished video
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Upload Your Clips",
                  desc: "Drag and drop up to 30 video files at once. Any phone video works.",
                },
                {
                  step: "02",
                  title: "Set the Duration",
                  desc: "Choose how many seconds to use from each clip. The app calculates total length automatically.",
                },
                {
                  step: "03",
                  title: "Download & Share",
                  desc: "Your aesthetic video is created in your browser. Download it and post to TikTok or Reels.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative flex flex-col gap-4 p-6 rounded-2xl bg-[#111118] border border-[#1F1F2E]"
                >
                  <span className="text-5xl font-black bg-gradient-to-b from-purple-500/30 to-transparent bg-clip-text text-transparent leading-none">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-gray-100">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-8 px-6 border-t border-[#1F1F2E]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">{appName}</span>
          </div>
          {footerText && (
            <p className="text-xs text-gray-600 text-center">{footerText}</p>
          )}
          <p className="text-xs text-gray-700">
            &copy; {new Date().getFullYear()} {appName}
          </p>
        </div>
      </footer>
    </div>
  );
}
