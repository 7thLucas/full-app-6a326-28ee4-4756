import { useEffect, useRef, useState } from "react";
import { X, Film } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ClipItem } from "~/video-processor/src/services/video.service";

interface ClipCardProps {
  clip: ClipItem;
  index: number;
  onRemove: (id: string) => void;
}

export function ClipCard({ clip, index, onRemove }: ClipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      video.currentTime = 0.1;
    };
    const handleSeeked = () => {
      setThumbLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const truncateName = (name: string, maxLen = 20) => {
    if (name.length <= maxLen) return name;
    const ext = name.lastIndexOf(".");
    if (ext > 0) {
      const base = name.substring(0, ext);
      const extension = name.substring(ext);
      return base.substring(0, maxLen - extension.length - 3) + "..." + extension;
    }
    return name.substring(0, maxLen - 3) + "...";
  };

  return (
    <div
      className={cn(
        "relative group animate-fade-in-up",
        "bg-[#111118] border border-[#1F1F2E] rounded-xl overflow-hidden",
        "transition-all duration-200 ease-out",
        "hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]",
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] bg-[#0A0A0F] overflow-hidden">
        {!thumbLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-8 h-8 text-gray-600" />
          </div>
        )}
        <video
          ref={videoRef}
          src={clip.objectUrl}
          muted
          preload="metadata"
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            "transition-opacity duration-300",
            thumbLoaded ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Clip number badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-xs font-bold text-gray-300">
          #{index + 1}
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm text-xs font-bold text-white">
          {clip.durationSec}s
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(clip.id)}
          aria-label={`Remove clip ${clip.name}`}
          className={cn(
            "absolute top-2 right-2",
            "flex items-center justify-center w-7 h-7 rounded-full",
            "bg-black/70 backdrop-blur-sm",
            "text-gray-300 hover:text-white hover:bg-red-500/80",
            "transition-all duration-150 ease-out",
            "opacity-0 group-hover:opacity-100",
          )}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="px-3 py-2">
        <p
          className="text-xs font-medium text-gray-300 truncate"
          title={clip.name}
        >
          {truncateName(clip.name)}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          {formatSize(clip.file.size)}
        </p>
      </div>
    </div>
  );
}
