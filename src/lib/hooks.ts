import { useEffect, useState } from 'react';

/** Current time, re-rendering once per minute on the minute. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: number;
    const tick = () => {
      const d = new Date();
      setNow(d);
      timer = window.setTimeout(tick, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()));
    };
    timer = window.setTimeout(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    return () => window.clearTimeout(timer);
  }, []);
  return now;
}

export function formatTime(d: Date) {
  const h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

const DEVICE_W = 421;
const DEVICE_H = 880;

/** How much to shrink the device so it always fits the window. */
export function useDeviceScale(enabled: boolean) {
  const compute = () =>
    Math.min(1, (window.innerHeight - 56) / DEVICE_H, (window.innerWidth - 32) / DEVICE_W);
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    if (!enabled) return;
    const onResize = () => setScale(compute());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [enabled]);
  return enabled ? scale : 1;
}

export const DEVICE = { width: DEVICE_W, height: DEVICE_H };
