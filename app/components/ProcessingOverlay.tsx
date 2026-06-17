import { Sparkles } from "lucide-react";
import type { ProcessingProgress } from "~/video-processor/src/services/video.service";

interface ProcessingOverlayProps {
  progress: ProcessingProgress;
}

export function ProcessingOverlay({ progress }: ProcessingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F]/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 px-8 py-10 max-w-sm w-full mx-4">
        {/* Animated icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 animate-ping" />
        </div>

        {/* Stage label */}
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
            {progress.stage === "preparing" && "Preparing"}
            {progress.stage === "encoding" && "Encoding"}
            {progress.stage === "merging" && "Merging"}
            {progress.stage === "done" && "Done!"}
          </p>
          <p className="text-lg font-semibold text-gray-200">{progress.message}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-2 bg-[#1F1F2E] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{progress.progress}%</span>
            <span>processing in browser</span>
          </div>
        </div>
      </div>
    </div>
  );
}
