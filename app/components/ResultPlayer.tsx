import { Download, RefreshCw } from "lucide-react";
import { GradientButton } from "./GradientButton";

interface ResultPlayerProps {
  blobUrl: string;
  appName: string;
  onReset: () => void;
}

export function ResultPlayer({ blobUrl, appName, onReset }: ResultPlayerProps) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = blobUrl;
    const ts = new Date().toISOString().slice(0, 10);
    a.download = `${appName.replace(/\s+/g, "_")}_${ts}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Success badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm font-semibold text-emerald-400">
          Your video is ready
        </span>
      </div>

      {/* Video player */}
      <div className="w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-[#1F1F2E] shadow-[0_0_40px_rgba(168,85,247,0.15)]">
        <video
          src={blobUrl}
          controls
          autoPlay
          loop
          playsInline
          className="w-full aspect-[9/16] bg-[#0A0A0F] object-contain"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <GradientButton
          onClick={handleDownload}
          size="md"
          className="flex-1"
        >
          <Download className="w-4 h-4" />
          Download
        </GradientButton>

        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full
            border border-[#1F1F2E] text-gray-400 hover:text-white hover:border-purple-500/40
            transition-all duration-150 text-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          Create Another
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Video processed in your browser — no cloud upload required
      </p>
    </div>
  );
}
