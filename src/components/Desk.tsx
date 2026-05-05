import type { ReactNode } from 'react';
import { profile } from '../lib/content';

type Props = {
  scale: number;
  device: { width: number; height: number };
  locked: boolean;
  onSideButton: () => void;
  children: ReactNode;
};

/** Everything around the phone on a laptop or desktop. */
export function Desk({ scale, device, locked, onSideButton, children }: Props) {
  return (
    <main className="desk">
      <div className="desk-glow" aria-hidden />

      <aside className="desk-side desk-intro">
        <p className="desk-kicker">Portfolio</p>
        <p className="desk-name">{profile.name}</p>
        <p className="desk-lead">
          {profile.role} and MS in Artificial Intelligence student at UT Austin. This portfolio is a working
          iPhone — open the apps to see my projects, experience, and skills.
        </p>
        <p className="desk-links">
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </aside>

      <div className="device-slot" style={{ width: device.width * scale, height: device.height * scale }}>
        <div className="device" style={{ transform: `scale(${scale})` }}>
          <span className="device-button device-action" aria-hidden />
          <span className="device-button device-volume-up" aria-hidden />
          <span className="device-button device-volume-down" aria-hidden />
          <button
            type="button"
            className="device-button device-power"
            onClick={onSideButton}
            disabled={locked}
            aria-label="Side button: lock the phone"
            title="Lock"
          />
          <div className="device-bezel">{children}</div>
        </div>
      </div>

      <aside className="desk-side desk-hints" aria-label="How to use">
        <dl>
          <div>
            <dt>Open an app</dt>
            <dd>Click any icon or widget.</dd>
          </div>
          <div>
            <dt>Go home</dt>
            <dd>
              Drag the bar at the bottom up, or press <kbd>Esc</kbd>.
            </dd>
          </div>
          <div>
            <dt>Lock</dt>
            <dd>Press the side button on the right.</dd>
          </div>
          <div>
            <dt>Dark mode</dt>
            <dd>Follows your system, or set it in Settings.</dd>
          </div>
        </dl>
      </aside>
    </main>
  );
}
