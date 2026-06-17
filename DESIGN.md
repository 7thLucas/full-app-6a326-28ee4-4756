# Magic Video — Design Guidelines

## Visual Identity
- **Style**: Dark, cinematic, premium. Dark-mode first.
- **Palette**:
  - Background: #0A0A0F (near-black)
  - Surface / card: #111118
  - Accent primary: #A855F7 (electric violet / purple)
  - Accent secondary: #EC4899 (hot pink)
  - Gradient: linear from #A855F7 → #EC4899 (used on CTAs, highlights)
  - Text primary: #F9FAFB
  - Text muted: #6B7280
  - Border / divider: #1F1F2E
- **Mood**: Like a polished video editing tool meets a consumer creator app — feels powerful but approachable.

## Typography
- **Font family**: Inter (sans-serif), loaded via Google Fonts
- **Headings**: Bold or Extra-Bold, tight letter-spacing
- **Body**: Regular weight, comfortable line-height (1.6)
- **Accent labels**: Uppercase, wide letter-spacing, small size (e.g. step labels)

## Layout & Spacing
- Full-width hero section on landing/home
- Max content width: 1200px, centered
- Generous padding (px-6 on mobile, px-12 on desktop)
- Sections separated by clear breathing room (py-16 or more)
- Cards with subtle border + very slight glow on hover

## Components
- **Upload area**: Large drag-and-drop zone, dashed border with purple glow on hover, icon + instructional copy inside
- **Clip grid**: Responsive grid of video thumbnail cards; each card shows clip name, duration badge, a remove button
- **Duration control**: A clean number input or slider labeled "Seconds per clip", with live calculation showing "Total video: X minutes Y seconds"
- **CTA button**: Pill-shaped, gradient background (#A855F7 → #EC4899), bold label, slight glow/shadow
- **Progress indicator**: Slim animated progress bar in gradient colors during processing
- **Preview player**: Centered video player with rounded corners, dark background

## Motion & Feel
- Smooth hover transitions (150–200ms ease)
- Upload zone pulses subtly when dragging files over it
- Cards animate in with a gentle fade+slide on add
- Processing state shows animated gradient progress bar

## Responsive
- Mobile-first layout
- Single-column on mobile, multi-column grid on desktop
- Upload zone and controls stack vertically on small screens

## Anti-references
- No cluttered timelines or complex editing UI
- No light/white backgrounds
- No flat, boring corporate look
- Nothing that looks like legacy desktop software
