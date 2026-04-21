import React, { useEffect, useRef } from 'react';
import { ReactTyped } from 'react-typed';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Canvas ink-stroke trail
// Draws a smooth, tapered brush stroke that follows the mouse and fades out
// like wet ink — nothing visible until the cursor enters the hero section.
// ---------------------------------------------------------------------------
export function renderCanvas(canvas) {
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  resize();

  // History of {x, y, t} — we keep up to TRAIL_MS milliseconds
  const TRAIL_MS = 900;
  const history = [];
  let frameId;

  const section = canvas.closest('section') || canvas.parentElement;

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    history.push({ x: clientX - rect.left, y: clientY - rect.top, t: Date.now() });
  };

  section.addEventListener('mousemove', onMove, { passive: true });
  section.addEventListener('touchmove', onMove, { passive: true });

  function draw() {
    const now = Date.now();

    // Expire old points
    while (history.length > 0 && now - history[0].t > TRAIL_MS) {
      history.shift();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (history.length < 2) {
      frameId = requestAnimationFrame(draw);
      return;
    }

    // Draw each segment with opacity and width based on age
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];

      // age: 0 = oldest end, 1 = newest (cursor position)
      const age = i / (history.length - 1);
      const alpha = age * 0.65;
      const lineWidth = age * 4 + 0.5;

      ctx.beginPath();

      if (i === 1) {
        ctx.moveTo(prev.x, prev.y);
      } else {
        // Use midpoint of previous segment as start for smooth joins
        const pprev = history[i - 2];
        const mx = (pprev.x + prev.x) / 2;
        const my = (pprev.y + prev.y) / 2;
        ctx.moveTo(mx, my);
      }

      const mx = (prev.x + curr.x) / 2;
      const my = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, mx, my);

      ctx.strokeStyle = `rgba(15, 118, 110, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    frameId = requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', resize, { passive: true });

  return () => {
    cancelAnimationFrame(frameId);
    section.removeEventListener('mousemove', onMove);
    section.removeEventListener('touchmove', onMove);
    window.removeEventListener('resize', resize);
  };
}

// ---------------------------------------------------------------------------
// Canvas component
// ---------------------------------------------------------------------------
export function HeroCanvas({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = renderCanvas(ref.current);
    return cleanup;
  }, []);

  return (
    <canvas
      ref={ref}
      className={cn('absolute inset-0 h-full w-full', className)}
    />
  );
}

// ---------------------------------------------------------------------------
// TypeWriter cycling text
// ---------------------------------------------------------------------------
export function TypeWriter({ strings, className }) {
  return (
    <span className={className}>
      <ReactTyped
        strings={strings}
        typeSpeed={55}
        backSpeed={35}
        backDelay={2000}
        loop
        smartBackspace
      />
    </span>
  );
}

// ---------------------------------------------------------------------------
// HoverGlowBorder — revolving arc border that appears on hover, pauses on click
// Works on any card or button. The spinner sits at inset:-2px with its own
// overflow:hidden so only the 2px border strip is visible; children's opaque
// backgrounds cover the interior.
// ---------------------------------------------------------------------------
export function HoverGlowBorder({ children, className, radius = 12, duration = 2.5 }) {
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState(false);

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {/* Spinning border — uses CSS mask-donut so only the 2px border strip
          is ever painted; the card interior stays completely untouched. */}
      {hovered && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            borderRadius: radius,
            padding: '2px',
            // Donut mask: content-box punches a hole through the centre,
            // leaving only the 2px padding strip visible.
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        >
          <span
            className="shine-border-spin absolute"
            style={{
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
              animationDuration: `${duration}s`,
              animationPlayState: active ? 'paused' : 'running',
              background:
                'conic-gradient(from 0deg, transparent 0%, transparent 68%, #6ee7b7 74%, #14b8a6 79%, #0f766e 83%, transparent 88%, transparent 100%)',
            }}
          />
        </span>
      )}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ShineBorder — revolving conic-gradient border with glow
// A square spinner sits behind the pill, cropped by overflow-hidden,
// and rotates a conic gradient so a bright arc sweeps continuously around.
// ---------------------------------------------------------------------------
export function ShineBorder({
  children,
  className,
  duration = 3,
}) {
  return (
    <div className={cn('relative w-fit rounded-full p-[2px] overflow-hidden', className)}>
      {/* Spinning conic gradient — the "revolving border" */}
      <div
        className="shine-border-spin absolute"
        style={{
          // Make it large enough to cover all corners as a square
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background:
            'conic-gradient(from 0deg, transparent 0%, transparent 65%, #6ee7b7 72%, #14b8a6 78%, #0f766e 82%, transparent 88%, transparent 100%)',
          animationDuration: `${duration}s`,
        }}
      />
      {/* Glow layer — softens the light spill */}
      <div
        className="shine-border-spin absolute"
        style={{
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background:
            'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(110,231,183,0.25) 70%, rgba(20,184,166,0.4) 78%, rgba(15,118,110,0.25) 84%, transparent 90%, transparent 100%)',
          animationDuration: `${duration}s`,
          filter: 'blur(4px)',
        }}
      />
      {/* Content sits above the spinning gradients */}
      <div className="relative rounded-full bg-white/95 px-5 py-2">
        {children}
      </div>
    </div>
  );
}
