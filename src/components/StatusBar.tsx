import { formatTime, useClock } from '../lib/hooks';

export function StatusBar({ tone, hideTime }: { tone: 'light' | 'auto'; hideTime?: boolean }) {
  const now = useClock();
  return (
    <div className="status-bar" data-tone={tone} aria-hidden>
      <span className="status-time" data-hidden={hideTime || undefined}>
        {formatTime(now)}
      </span>
      <span className="status-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .6C5.2.6 2.7 1.7.8 3.5L2 4.8a8.6 8.6 0 0 1 6-2.4Z" />
          <path d="M8 5.9c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 4.1 7 7 0 0 0 3.2 6l1.2 1.3c1-.9 2.2-1.4 3.6-1.4Z" />
          <path d="M8 9.3c.5 0 .9.2 1.2.5L8 11.4 6.8 9.8c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x=".5" y=".5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".35" />
          <rect x="2" y="2" width="17" height="9" rx="2.5" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".4" />
        </svg>
      </span>
    </div>
  );
}
