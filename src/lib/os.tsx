import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';

export type AppId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'resume'
  | 'education'
  | 'messages'
  | 'settings';

export const APP_IDS: AppId[] = [
  'about',
  'experience',
  'projects',
  'skills',
  'resume',
  'education',
  'messages',
  'settings',
];

/** A rectangle in the screen's own (unscaled) coordinate space. */
export type Rect = { x: number; y: number; w: number; h: number; radius: number };

export type Theme = 'auto' | 'light' | 'dark';

export type Settings = {
  theme: Theme;
  reduceMotion: boolean;
  reduceTransparency: boolean;
};

export type Note = { icon: ReactNode; title: string; detail?: string };

type OS = {
  openApp: (id: AppId, source?: HTMLElement | null) => void;
  closeApp: () => void;
  notify: (note: Note) => void;
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
  /** True when the OS setting or the in-phone Settings toggle asks for less motion. */
  reduceMotion: boolean;
  /** Whether the site fills a real phone screen instead of drawing a device frame. */
  fullscreen: boolean;
};

export const OSContext = createContext<OS | null>(null);

export function useOS() {
  const os = useContext(OSContext);
  if (!os) throw new Error('useOS must be used inside the OS provider');
  return os;
}

// Back handlers: the innermost open view (a pushed detail page) gets Escape first.
type BackHandler = () => boolean;
const backHandlers: BackHandler[] = [];

export function runBackHandlers() {
  for (let i = backHandlers.length - 1; i >= 0; i--) {
    if (backHandlers[i]()) return true;
  }
  return false;
}

export function useBackHandler(handler: () => void, active: boolean) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return;
    const h: BackHandler = () => {
      ref.current();
      return true;
    };
    backHandlers.push(h);
    return () => {
      const i = backHandlers.indexOf(h);
      if (i >= 0) backHandlers.splice(i, 1);
    };
  }, [active]);
}

const KEY = 'sp-phone-settings';

export function loadSettings(): Settings {
  const fallback: Settings = { theme: 'auto', reduceMotion: false, reduceTransparency: false };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Private mode or blocked storage: settings just won't persist.
  }
}

/** Apple's momentum projection (Designing Fluid Interfaces). Velocity in px/s. */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

export const springs = {
  /** Critically damped — the default for anything that isn't thrown. */
  settle: { type: 'spring', duration: 0.5, bounce: 0 },
  /** A little overshoot, only after a gesture carried momentum. */
  momentum: { type: 'spring', duration: 0.5, bounce: 0.2 },
  /** Navigation push/pop. */
  push: { type: 'spring', duration: 0.45, bounce: 0 },
  /** Dynamic Island — it should feel alive. */
  island: { type: 'spring', duration: 0.5, bounce: 0.3 },
} as const;
