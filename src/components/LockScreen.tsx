import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { Lock, LockOpen, MapPin } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { apps, IconArt } from '../lib/apps';
import { profile } from '../lib/content';
import { formatDate, formatTime, useClock } from '../lib/hooks';
import { project, rubberband, springs, type AppId } from '../lib/os';
import { Wallpaper } from './Wallpaper';

type Props = {
  height: number;
  scale: number;
  enterFromTop: boolean;
  reduceMotion: boolean;
  /** Fires once a re-lock has fully covered the screen. */
  onEntered: () => void;
  onUnlockStart: () => void;
  onUnlocked: (then?: AppId) => void;
};

export function LockScreen({ height, scale, enterFromTop, reduceMotion, onEntered, onUnlockStart, onUnlocked }: Props) {
  const now = useClock();
  const y = useMotionValue(enterFromTop && !reduceMotion ? -height : 0);
  const fade = useMotionValue(enterFromTop && reduceMotion ? 0 : 1);
  const transform = useTransform(y, (v) => `translate3d(0, ${v}px, 0)`);
  const contentOpacity = useTransform(y, [-height * 0.45, 0], [0, 1]);
  const [unlocking, setUnlocking] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ id: number; startY: number; startT: number; moved: boolean; onNote: boolean } | null>(null);

  useEffect(() => {
    if (!enterFromTop) return;
    const anim = reduceMotion
      ? animate(fade, 1, { duration: 0.2, ease: 'easeOut' })
      : animate(y, 0, springs.settle);
    anim.then(() => onEntered());
    return () => anim.stop();
  }, []);

  function unlock(velocity = 0, then?: AppId) {
    if (unlocking) return;
    setUnlocking(true);
    onUnlockStart();
    const done = () => onUnlocked(then);
    if (reduceMotion) animate(fade, 0, { duration: 0.2, ease: 'easeOut' }).then(done);
    else animate(y, -height, { ...springs.settle, velocity }).then(done);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (unlocking || drag.current || e.button !== 0) return; // ignore a second finger
    rootRef.current?.setPointerCapture(e.pointerId);
    drag.current = {
      id: e.pointerId,
      startY: e.clientY,
      startT: performance.now(),
      moved: false,
      onNote: !!notificationRef.current?.contains(e.target as Node),
    };
    y.stop();
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = (e.clientY - d.startY) / scale;
    if (!d.moved && Math.abs(dy) < 10) return; // hysteresis before committing to a drag
    d.moved = true;
    // Up tracks 1:1; down resists like iOS.
    y.set(dy < 0 ? dy : rubberband(dy, height));
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) {
      unlock(0, d.onNote ? 'messages' : undefined);
      return;
    }
    const velocity = y.getVelocity();
    const projected = y.get() + project(velocity);
    if (projected < -height * 0.3) unlock(velocity);
    else animate(y, 0, { ...springs.momentum, velocity });
  }

  return (
    <motion.div
      ref={rootRef}
      className="lock"
      style={{ transform: reduceMotion ? undefined : transform, opacity: fade }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Wallpaper />
      <motion.div className="lock-content" style={{ opacity: reduceMotion ? 1 : contentOpacity }}>
        <div className="lock-top">
          <span className="lock-glyph" aria-hidden>
            {unlocking ? <LockOpen size={18} strokeWidth={2.2} /> : <Lock size={18} strokeWidth={2.2} />}
          </span>
          <p className="lock-date">{formatDate(now)}</p>
          <p className="lock-time">{formatTime(now)}</p>
          <div className="lock-widgets">
            <span className="glass-pill">{profile.role}</span>
            <span className="glass-pill">
              <MapPin size={12} strokeWidth={2.4} aria-hidden /> {profile.location}
            </span>
          </div>
        </div>

        <div className="lock-bottom">
          <button
            ref={notificationRef}
            type="button"
            className="notification glass"
            onClick={(e) => e.detail === 0 && unlock(0, 'messages')}
          >
            <IconArt background={apps.messages.background} glyph={apps.messages.glyph} size={38} />
            <span className="notification-body">
              <span className="notification-head">
                <strong>{profile.name}</strong>
                <span>now</span>
              </span>
              <span className="notification-text">
                Hey 👋 thanks for stopping by. Swipe up to see what I’ve been building.
              </span>
            </span>
          </button>
          <button type="button" className="lock-hint" onClick={(e) => e.detail === 0 && unlock()}>
            Swipe up or tap to open
          </button>
        </div>
      </motion.div>
      <span className="home-indicator home-indicator-light" aria-hidden />
    </motion.div>
  );
}
