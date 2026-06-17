import { Upload, Timer, Sparkles, Download } from "lucide-react";
import type { TFeatureItem } from "~/modules/configurables/src/constants/configurables.default";
import { cn } from "~/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  upload: <Upload className="w-6 h-6" />,
  timer: <Timer className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  download: <Download className="w-6 h-6" />,
};

interface FeatureCardProps {
  feature: TFeatureItem;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const icon = iconMap[feature.icon] ?? <Sparkles className="w-6 h-6" />;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 rounded-2xl",
        "bg-[#111118] border border-[#1F1F2E]",
        "transition-all duration-200 ease-out",
        "hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]",
        "animate-fade-in-up",
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-purple-400">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-100 mb-1">{feature.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}
