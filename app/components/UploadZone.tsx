import { useCallback, useRef, useState } from "react";
import { Upload, Film } from "lucide-react";
import { cn } from "~/lib/utils";

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  uploadAreaLabel: string;
  disabled?: boolean;
}

export function UploadZone({ onFiles, uploadAreaLabel, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type.startsWith("video/"),
      );
      if (files.length > 0) onFiles(files);
    },
    [onFiles, disabled],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) onFiles(files);
      // Reset so same files can be re-added
      e.target.value = "";
    },
    [onFiles],
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload video clips"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          inputRef.current?.click();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4",
        "min-h-[220px] w-full rounded-2xl cursor-pointer",
        "border-2 border-dashed",
        "transition-all duration-200 ease-out",
        "select-none",
        isDragging
          ? "border-purple-400 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.25)] scale-[1.01]"
          : "border-[#1F1F2E] bg-[#111118] hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <div
        className={cn(
          "flex items-center justify-center w-16 h-16 rounded-2xl",
          "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
          "border border-purple-500/20",
          "transition-transform duration-200",
          isDragging ? "scale-110" : "",
        )}
      >
        {isDragging ? (
          <Film className="w-8 h-8 text-purple-400" />
        ) : (
          <Upload className="w-8 h-8 text-purple-400" />
        )}
      </div>

      <div className="text-center px-4">
        <p className="text-base font-semibold text-gray-200">
          {isDragging ? "Release to add clips" : uploadAreaLabel}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Supports MP4, MOV, WebM, AVI — up to 20MB per clip
        </p>
      </div>

      {isDragging && (
        <div className="absolute inset-0 rounded-2xl bg-purple-500/5 pointer-events-none" />
      )}
    </div>
  );
}
