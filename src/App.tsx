import { MotionConfig, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { About } from './apps/About';
import { Education } from './apps/Education';
import { Experience } from './apps/Experience';
import { Projects } from './apps/Projects';
import { Skills } from './apps/Skills';
import { AppWindow } from './components/AppWindow';
import { Desk } from './components/Desk';
import { HomeScreen } from './components/HomeScreen';
import { LockScreen } from './components/LockScreen';
import { StatusBar } from './components/StatusBar';
import { apps } from './lib/apps';
import { DEVICE, useDeviceScale, useMediaQuery } from './lib/hooks';
import {
  APP_IDS,
  loadSettings,
  OSContext,
  runBackHandlers,
  saveSettings,
  type AppId,
  type Note,
  type Rect,
  type Settings as SettingsT,
} from './lib/os';

const screens: Record<AppId, () => ReactNode> = {
  about: () => <About />,
  experience: () => <Experience />,
  projects: () => <Projects />,
  skills: () => <Skills />,
  resume: () => null,
  education: () => <Education />,
  messages: () => null,
  settings: () => null,
};

type Win = { id: AppId; origin: Rect; phase: 'open' | 'closing'; key: number; source: HTMLElement | null };
type LockState = 'locked' | 'unlocking' | 'open';

const SCREEN_RADIUS = 55;

function hashApp(): AppId | null {
  const id = window.location.hash.slice(1) as AppId;
  return APP_IDS.includes(id) ? id : null;
}

export default function App() {
  const fullscreen = useMediaQuery('(max-width: 520px)');
  const scale = useDeviceScale(!fullscreen);
  const systemReduce = useReducedMotion() ?? false;
  const [settings, setSettingsState] = useState<SettingsT>(loadSettings);
  const reduceMotion = systemReduce || settings.reduceMotion;

  const [lock, setLock] = useState<LockState>(() => (hashApp() ? 'open' : 'locked'));
  const [lockFromTop, setLockFromTop] = useState(false);
  const [homeEntered, setHomeEntered] = useState(lock === 'open');
  const [win, setWin] = useState<Win | null>(null);
  const winRef = useRef(win);
  winRef.current = win;
  const keyRef = useRef(0);

  const [note, setNote] = useState<Note | null>(null);
  const noteTimer = useRef(0);

  const screenRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 393, h: 852 });

  useLayoutEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fullscreen]);

  // ---- settings ----
  const setSettings = useCallback((patch: Partial<SettingsT>) => {
    setSettingsState((s) => {
      const next = { ...s, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', settings.theme);
    root.toggleAttribute('data-reduce-transparency', settings.reduceTransparency);
    root.toggleAttribute('data-reduce-motion', settings.reduceMotion);
  }, [settings.theme, settings.reduceTransparency, settings.reduceMotion]);

  // ---- notifications ----
  const notify = useCallback((n: Note) => {
    setNote(n);
    window.clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => setNote(null), 2600);
  }, []);

  // ---- windows ----
  const originFor = useCallback(
    (id: AppId, source?: HTMLElement | null): { rect: Rect; el: HTMLElement | null } => {
      const screen = screenRef.current;
      const el =
        source ?? screen?.querySelector<HTMLElement>(`.home [data-app-id="${id}"]`) ?? null;
      if (!screen || !el) {
        const w = 62;
        return { rect: { x: size.w / 2 - w / 2, y: size.h / 2 - w / 2, w, h: w, radius: 14 }, el: null };
      }
      const art = el.querySelector<HTMLElement>('.icon-art') ?? el;
      const s = screen.getBoundingClientRect();
      const r = art.getBoundingClientRect();
      const k = fullscreen ? 1 : scale;
      const radius = parseFloat(getComputedStyle(art).borderTopLeftRadius) || 14;
      return {
        rect: { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k, radius },
        el: art,
      };
    },
    [fullscreen, scale, size],
  );

  const openApp = useCallback(
    (id: AppId, source?: HTMLElement | null, fromHistory = false) => {
      const current = winRef.current;
      // Tapping the icon again while it folds away reverses it from wherever it is.
      if (current && current.id === id && current.phase === 'closing') {
        setWin({ ...current, phase: 'open' });
        if (!fromHistory) history.pushState({ app: id }, '', `#${id}`);
        return;
      }
      if (current && current.id === id) return;
      current?.source?.removeAttribute('data-launching');
      const { rect, el } = originFor(id, source);
      el?.setAttribute('data-launching', '');
      setWin({ id, origin: rect, phase: 'open', key: ++keyRef.current, source: el });
      if (!fromHistory) {
        if (history.state?.app) history.replaceState({ app: id }, '', `#${id}`);
        else history.pushState({ app: id }, '', `#${id}`);
      }
    },
    [originFor],
  );

  const closeApp = useCallback((fromHistory = false) => {
    const current = winRef.current;
    if (!current || current.phase === 'closing') return;
    setWin({ ...current, phase: 'closing' });
    if (!fromHistory && history.state?.app) history.back();
  }, []);

  const onClosed = useCallback(() => {
    const current = winRef.current;
    if (!current) return;
    const button = current.source?.closest<HTMLElement>('button, a');
    current.source?.removeAttribute('data-launching');
    setWin(null);
    button?.focus({ preventScroll: true });
  }, []);

  // Browser back/forward drives the same open/close as the UI.
  useEffect(() => {
    const onPop = () => {
      const id = (history.state?.app as AppId | undefined) ?? null;
      if (id) openApp(id, null, true);
      else closeApp(true);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [openApp, closeApp]);

  // Deep link: /#projects skips the lock screen and opens the app.
  useEffect(() => {
    const id = hashApp();
    if (!id) return;
    history.replaceState(null, '', window.location.pathname);
    requestAnimationFrame(() => openApp(id));
  }, []);

  // Escape: pop a pushed page first, then go home.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || lock !== 'open') return;
      if (runBackHandlers()) return;
      closeApp();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lock, closeApp]);

  const lockPhone = useCallback(() => {
    if (lock !== 'open') return;
    setLockFromTop(true);
    setLock('locked');
  }, [lock]);

  const onUnlocked = useCallback(
    (then?: AppId) => {
      setLock('open');
      setLockFromTop(false);
      requestAnimationFrame(() => {
        if (then) openApp(then);
        // The lock screen held focus; hand it to the first thing on the home screen.
        else screenRef.current?.querySelector<HTMLElement>('.home button')?.focus({ preventScroll: true });
      });
    },
    [openApp],
  );

  // Keep the browser chrome in tune with what's on screen.
  useEffect(() => {
    if (!fullscreen) return;
    const dark =
      settings.theme === 'dark' ||
      (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const color = win && lock === 'open' ? (dark ? '#000000' : '#f2f2f7') : '#0d1030';
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', color));
  }, [fullscreen, win, lock, settings.theme]);

  const os = useMemo(
    () => ({
      openApp,
      closeApp: () => closeApp(),
      notify,
      settings,
      setSettings,
      reduceMotion,
      fullscreen,
    }),
    [openApp, closeApp, notify, settings, setSettings, reduceMotion, fullscreen],
  );

  const appOpen = !!win && win.phase === 'open';

  const screen = (
    <div
      ref={screenRef}
      className="screen"
      data-fullscreen={fullscreen || undefined}
      data-app-open={(appOpen && lock === 'open') || undefined}
    >
      <HomeScreen
        entered={homeEntered}
        inert={lock !== 'open' || appOpen}
        onOpen={(id, el) => openApp(id, el)}
      />

      {win && (
        <AppWindow
          key={win.key}
          app={apps[win.id]}
          origin={win.origin}
          width={size.w}
          height={size.h}
          screenRadius={fullscreen ? 0 : SCREEN_RADIUS}
          scale={fullscreen ? 1 : scale}
          phase={win.phase}
          reduceMotion={reduceMotion}
          onRequestClose={() => closeApp()}
          onClosed={onClosed}
        >
          {screens[win.id]()}
        </AppWindow>
      )}

      {lock !== 'open' && (
        <LockScreen
          key={lockFromTop ? 'relock' : 'boot'}
          height={size.h}
          scale={fullscreen ? 1 : scale}
          enterFromTop={lockFromTop}
          reduceMotion={reduceMotion}
          onEntered={() => setHomeEntered(false)}
          onUnlockStart={() => {
            setLock('unlocking');
            setHomeEntered(true);
          }}
          onUnlocked={onUnlocked}
        />
      )}

      {!fullscreen && (
        <StatusBar tone={appOpen && lock === 'open' ? 'auto' : 'light'} hideTime={lock === 'locked'} />
      )}
    </div>
  );

  return (
    <OSContext.Provider value={os}>
      <MotionConfig reducedMotion={settings.reduceMotion ? 'always' : 'user'}>
        {fullscreen ? (
          <main className="fullscreen">{screen}</main>
        ) : (
          <Desk scale={scale} device={DEVICE} onSideButton={lockPhone} locked={lock !== 'open'}>
            {screen}
          </Desk>
        )}
      </MotionConfig>
    </OSContext.Provider>
  );
}
