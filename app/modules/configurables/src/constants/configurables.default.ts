/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TFeatureItem = {
  icon: string;
  title: string;
  description: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  tagline?: string;
  heroHeading?: string;
  heroSubheading?: string;
  ctaLabel?: string;
  uploadAreaLabel?: string;
  defaultSecondsPerClip?: number;
  maxClips?: number;
  brandColor: TBrandColor;
  features?: TFeatureItem[];
  footerText?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Magic Video",
  logoUrl: "FILL_LOGO_URL_HERE",
  tagline: "Turn your clips into magic.",
  heroHeading: "Create Stunning Videos in Seconds",
  heroSubheading: "Upload your clips, set the duration, and let Magic Video do the rest. One tap to a polished, aesthetic video ready for TikTok & Reels.",
  ctaLabel: "Start Creating",
  uploadAreaLabel: "Drop your video clips here, or click to browse",
  defaultSecondsPerClip: 2,
  maxClips: 30,
  brandColor: {
    primary: "#A855F7",
    secondary: "#EC4899",
    accent: "#A855F7",
  },
  features: [
    {
      icon: "upload",
      title: "Batch Upload",
      description: "Upload up to 30 video clips in one go with drag-and-drop simplicity.",
    },
    {
      icon: "timer",
      title: "Uniform Duration",
      description: "Set one duration per clip — the app calculates your total video length automatically.",
    },
    {
      icon: "sparkles",
      title: "Auto Aesthetic",
      description: "Cinematic filters and smooth transitions applied automatically. Beautiful by default.",
    },
    {
      icon: "download",
      title: "Export & Share",
      description: "Download your finished video and share it straight to TikTok or Instagram Reels.",
    },
  ],
  footerText: "Magic Video — made for creators who move fast.",
};
