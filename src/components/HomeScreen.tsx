import { GraduationCap, MapPin } from 'lucide-react';
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { apps, IconArt, links, type LinkDef } from '../lib/apps';
import { profile, stats } from '../lib/content';
import { type AppId } from '../lib/os';
import { Wallpaper } from './Wallpaper';

type Props = {
  entered: boolean;
  inert: boolean;
  onOpen: (id: AppId, source: HTMLElement) => void;
};

const ICON = 62;

export function HomeScreen({ entered, inert, onOpen }: Props) {
  const homeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  useFitGrid(homeRef, gridRef, dockRef);
  let i = 0;
  const next = () => ({ '--i': i++ }) as CSSProperties;

  const appIcon = (id: AppId) => {
    const app = apps[id];
    return (
      <button
        key={id}
        type="button"
        className="icon"
        data-app-id={id}
        style={next()}
        onClick={(e) => onOpen(id, e.currentTarget)}
      >
        <IconArt background={app.background} glyph={app.glyph} glyphColor={app.glyphColor} size={ICON} />
        <span className="icon-label">{app.name}</span>
      </button>
    );
  };

  const linkIcon = (link: LinkDef, label = true) => (
    <a
      key={link.id}
      className="icon"
      href={link.href}
      style={next()}
      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={label ? undefined : link.name}
    >
      <IconArt background={link.background} glyph={link.glyph} size={ICON} />
      {label && <span className="icon-label">{link.name}</span>}
    </a>
  );

  return (
    <div ref={homeRef} className="home" data-entered={entered || undefined} inert={inert}>
      <Wallpaper />
      <h1 className="visually-hidden">
        {profile.name}, {profile.role}
      </h1>
      <div ref={gridRef} className="home-grid">
        <Widget
          className="widget-medium"
          label={profile.firstName}
          style={next()}
          appId="about"
          onOpen={onOpen}
          ariaLabel={`About ${profile.name}`}
        >
          <img className="widget-photo" src={profile.photo} alt="" width={118} height={118} />
          <span className="widget-profile">
            <span className="widget-name">{profile.name}</span>
            <span className="widget-role">{profile.role}</span>
            <span className="widget-meta">
              <GraduationCap size={13} strokeWidth={2.2} aria-hidden /> MS AI · UT Austin
            </span>
            <span className="widget-meta">
              <MapPin size={13} strokeWidth={2.2} aria-hidden /> {profile.location}
            </span>
          </span>
        </Widget>

        {appIcon('about')}
        {appIcon('experience')}
        {appIcon('projects')}
        {appIcon('skills')}

        <Widget
          className="widget-small"
          label="Stats"
          style={next()}
          appId="projects"
          onOpen={onOpen}
          ariaLabel="Stats — open Projects"
        >
          <span className="widget-stats">
            {stats.map((s) => (
              <span key={s.label} className="widget-stat">
                <span className="widget-stat-value">{s.value}</span>
                <span className="widget-stat-label">{s.label}</span>
              </span>
            ))}
          </span>
        </Widget>

        {appIcon('resume')}
        {appIcon('education')}
        {appIcon('settings')}
        {linkIcon(links.linkedin)}
      </div>

      <nav ref={dockRef} className="dock glass" aria-label="Dock">
        {linkIcon(links.phone, false)}
        <button
          type="button"
          className="icon"
          data-app-id="messages"
          style={next()}
          onClick={(e) => onOpen('messages', e.currentTarget)}
          aria-label="Messages"
        >
          <IconArt background={apps.messages.background} glyph={apps.messages.glyph} size={ICON} />
        </button>
        {linkIcon(links.mail, false)}
        {linkIcon(links.github, false)}
      </nav>
      <span className="home-indicator home-indicator-light" aria-hidden />
    </div>
  );
}

/**
 * Short screens (an iPhone in Safari with its toolbars showing) can't fit the grid above the dock.
 * Shrink the whole grid uniformly instead of letting icons slide under the dock.
 */
function useFitGrid(
  homeRef: RefObject<HTMLDivElement | null>,
  gridRef: RefObject<HTMLDivElement | null>,
  dockRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const home = homeRef.current;
    const grid = gridRef.current;
    const dock = dockRef.current;
    if (!home || !grid || !dock) return;
    const fit = () => {
      const available = dock.offsetTop - grid.offsetTop - 16;
      const scale = Math.min(1, available / grid.offsetHeight);
      grid.style.transform = scale < 1 ? `scale(${scale})` : '';
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(home);
    return () => ro.disconnect();
  }, [homeRef, gridRef, dockRef]);
}

function Widget({
  className,
  label,
  style,
  appId,
  onOpen,
  ariaLabel,
  children,
}: {
  className: string;
  label: string;
  style: CSSProperties;
  appId: AppId;
  onOpen: Props['onOpen'];
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <div className={`widget-slot ${className}`} style={style}>
      <button
        type="button"
        className="widget glass"
        aria-label={ariaLabel}
        onClick={(e) => onOpen(appId, e.currentTarget)}
      >
        {children}
      </button>
      <span className="icon-label">{label}</span>
    </div>
  );
}
