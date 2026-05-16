import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import type { AppDef } from '../lib/apps';
import { project, rubberband, springs, type Rect } from '../lib/os';

type Props = {
  app: AppDef;
  origin: Rect;
  width: number;
  height: number;
  screenRadius: number;
  scale: number;
  phase: 'open' | 'closing';
  reduceMotion: boolean;
  onRequestClose: () => void;
  onClosed: () => void;
  children: ReactNode;
};

const fade = { duration: 0.2, ease: 'easeOut' } as const;

export function AppWindow({
  app,
  origin,
  width: W,
  height: H,
  screenRadius,
  scale,
  phase,
  reduceMotion,
  onRequestClose,
  onClosed,
  children,
}: Props) {
  // 0 = folded into its icon, 1 = full screen.
  const progress = useMotionValue(0);
  // How far the home bar has been dragged up, in screen pixels.
  const lift = useMotionValue(0);
  const token = useRef(0);
  const releaseVelocity = useRef(0);
  const windowRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; startY: number; moved: boolean } | null>(null);

  // Geometry of the folded state, derived once from the source rect.
  const s0 = origin.w / W;
  const insetY0 = Math.max(0, (H - Math.min(H, (W * origin.h) / origin.w)) / 2);
  const cx = origin.x + origin.w / 2 - W / 2;
  const cy = origin.y + origin.h / 2 - H / 2;
  const r0 = origin.radius / s0;

  const transform = useTransform([progress, lift], ([p, d]: number[]) => {
    const s = s0 + (1 - s0) * p;
    // Card mode: shrink while keeping the bottom edge glued to the finger.
    const cardScale = d > 0 ? Math.max(0.42, 1 - (0.55 * d) / H) : 1;
    const cardY = d > 0 ? H / 2 - d - (cardScale * H) / 2 : -d;
    return `translate3d(${cx * (1 - p)}px, ${cy * (1 - p) + cardY}px, 0) scale(${s * cardScale})`;
  });

  const clipPath = useTransform([progress, lift], ([p, d]: number[]) => {
    const insetY = Math.max(0, insetY0 * (1 - p));
    const openRadius = screenRadius + Math.min(Math.max(d, 0) / 120, 1) * Math.max(0, 44 - screenRadius);
    const r = r0 + (openRadius - r0) * p;
    return `inset(${insetY}px 0px round ${r}px)`;
  });

  const iconOpacity = useTransform(progress, [0.04, 0.38], [1, 0]);
  const dim = useTransform([progress, lift], ([p, d]: number[]) => p * (1 - Math.min(Math.max(d, 0) / (H * 0.5), 1)));

  useEffect(() => {
    const t = ++token.current;
    if (phase === 'open') {
      windowRef.current?.focus({ preventScroll: true });
      animate(progress, 1, reduceMotion ? fade : springs.settle);
      if (lift.get() !== 0) animate(lift, 0, springs.settle);
      return;
    }
    const velocity = releaseVelocity.current;
    releaseVelocity.current = 0;
    const thrown = lift.get() > 1;
    animate(lift, 0, reduceMotion ? fade : springs.settle);
    animate(
      progress,
      0,
      reduceMotion
        ? fade
        : thrown
          ? // Momentum carried in from the flick earns a touch of overshoot.
            { ...springs.momentum, bounce: 0.12, velocity: -velocity / H }
          : springs.settle,
    ).then(() => {
      if (token.current === t) onClosed();
    });
  }, [phase]);

  function onPointerDown(e: PointerEvent<HTMLButtonElement>) {
    if (drag.current || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, startY: e.clientY, moved: false };
    windowRef.current?.closest('.screen')?.setAttribute('data-card', '');
    lift.stop();
  }

  function onPointerMove(e: PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = (d.startY - e.clientY) / scale;
    if (!d.moved && Math.abs(dy) < 6) return;
    d.moved = true;
    lift.set(dy > 0 ? dy : rubberband(dy, H) * 0.4);
  }

  function onPointerUp(e: PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    windowRef.current?.closest('.screen')?.removeAttribute('data-card');
    if (!d.moved) {
      onRequestClose();
      return;
    }
    const velocity = lift.getVelocity();
    if (lift.get() + project(velocity) > H * 0.22) {
      releaseVelocity.current = velocity;
      onRequestClose();
    } else {
      animate(lift, 0, { ...springs.momentum, velocity });
    }
  }

  const Glyph = app.glyph;

  return (
    <>
      <motion.div className="window-dim" style={{ opacity: reduceMotion ? 0 : dim }} aria-hidden />
      <motion.div
        ref={windowRef}
        className="window"
        role="dialog"
        aria-label={app.name}
        tabIndex={-1}
        data-surface={app.surface}
        data-closing={phase === 'closing' || undefined}
        style={
          reduceMotion
            ? { opacity: progress }
            : { transform, clipPath, WebkitClipPath: clipPath }
        }
      >
        <div className="window-content">{children}</div>
        {!reduceMotion && (
          <motion.div
            className="window-icon"
            style={{ background: app.background, color: app.glyphColor ?? '#fff', opacity: iconOpacity }}
            aria-hidden
          >
            <Glyph size={Math.round(31 / s0)} strokeWidth={1.9} />
          </motion.div>
        )}
        <button
          type="button"
          className="window-handle"
          aria-label="Go to Home Screen"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={(e) => e.detail === 0 && onRequestClose()}
        >
          <span className="home-indicator" />
        </button>
      </motion.div>
    </>
  );
}
