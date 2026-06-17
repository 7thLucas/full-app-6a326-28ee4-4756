import { type ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function GradientButton({
  className,
  children,
  size = "md",
  loading = false,
  disabled,
  ...props
}: GradientButtonProps) {
  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-bold text-white",
        "bg-gradient-to-r from-purple-500 to-pink-500",
        "shadow-lg shadow-purple-500/30",
        "transition-all duration-200 ease-out",
        "hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
        sizes[size],
        className,
      )}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
