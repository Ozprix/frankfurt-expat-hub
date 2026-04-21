import React from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// AuroraBackground
// Animated northern-lights background layer, brand-aligned to teal/emerald.
//
// Two usage patterns:
//   1. asLayer — drop as <AuroraBackground asLayer /> inside a relative container
//   2. Wrapper — <AuroraBackground className="min-h-[88vh]">{children}</AuroraBackground>
//
// Fix notes vs original Aceternity component:
//   • Removed `background-attachment:fixed` on ::after — it silently stops
//     rendering inside overflow:hidden containers (browser compositing quirk).
//     Both layers now use normal background-attachment so the clip works.
//   • Removed `invert` filter — original light-mode invert creates reddish
//     artifacts on a light (#f3f4ef) background. Teal colors show directly.
//   • mix-blend-soft-light on ::after instead of difference — difference
//     creates harsh dark inversions on light backgrounds.
//   • Opacity raised to 0.45 so the effect is clearly visible.
// ---------------------------------------------------------------------------

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  asLayer = false,
  ...props
}) => {
  const aurora = (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Primary animated layer */}
      <div
        className={cn(
          // Teal/emerald aurora — matches #0f766e brand primary
          '[--aurora:repeating-linear-gradient(100deg,var(--teal-600)_10%,var(--teal-300)_15%,var(--emerald-300)_20%,var(--teal-200)_25%,var(--teal-500)_30%)]',
          '[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]',
          // Background
          '[background-image:var(--white-gradient),var(--aurora)]',
          '[background-size:300%,_200%]',
          '[background-position:50%_50%,50%_50%]',
          // Animate the primary layer
          'animate-aurora',
          // Blur softens harsh gradient edges
          'blur-[10px]',
          // Second animated layer via ::after (no background-attachment:fixed —
          // that breaks inside overflow:hidden; use default 'scroll' instead)
          'after:content-[""] after:absolute after:inset-0',
          'after:[background-image:var(--white-gradient),var(--aurora)]',
          'after:[background-size:200%,_100%]',
          'after:[background-position:50%_50%,50%_50%]',
          'after:animate-aurora',
          'after:mix-blend-soft-light',
          // Sizing & stacking
          'pointer-events-none absolute -inset-[10px] will-change-transform',
          // Opacity — visible but not distracting over text
          'opacity-[0.45]',
          // Mask — concentrate glow toward top-right corner
          showRadialGradient &&
            '[mask-image:radial-gradient(ellipse_at_80%_0%,black_20%,transparent_70%)]'
        )}
      />
    </div>
  );

  if (asLayer) return aurora;

  return (
    <div className={cn('relative', className)} {...props}>
      {aurora}
      {children}
    </div>
  );
};

export default AuroraBackground;
