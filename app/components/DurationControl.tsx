import { Timer } from "lucide-react";
import { cn } from "~/lib/utils";

interface DurationControlProps {
  secondsPerClip: number;
  clipCount: number;
  onChange: (value: number) => void;
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export function DurationControl({
  secondsPerClip,
  clipCount,
  onChange,
}: DurationControlProps) {
  const totalSeconds = secondsPerClip * clipCount;
  const steps = [1, 2, 3, 5, 8, 10, 15, 20, 30];

  return (
    <div className="bg-[#111118] border border-[#1F1F2E] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          Duration per clip
        </span>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {steps.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150",
              secondsPerClip === s
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-[#1F1F2E] text-gray-400 hover:text-white hover:bg-[#2a2a3d]",
            )}
          >
            {s}s
          </button>
        ))}
      </div>

      {/* Custom slider */}
      <div className="space-y-2">
        <input
          type="range"
          min={1}
          max={30}
          value={secondsPerClip}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full cursor-pointer appearance-none
            bg-gradient-to-r from-purple-500 to-pink-500
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #A855F7 0%, #EC4899 ${((secondsPerClip - 1) / 29) * 100}%, #1F1F2E ${((secondsPerClip - 1) / 29) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>1s</span>
          <span>30s</span>
        </div>
      </div>

      {/* Summary */}
      {clipCount > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-[#1F1F2E]">
          <span className="text-sm text-gray-500">
            {clipCount} clip{clipCount !== 1 ? "s" : ""} × {secondsPerClip}s
          </span>
          <div className="text-right">
            <span className="text-sm text-gray-400">Total output</span>
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {formatDuration(totalSeconds)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
