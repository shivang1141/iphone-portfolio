import { Mail, Phone } from 'lucide-react';
import { GitHubMark, LinkedInMark } from '../lib/apps';
import { about, profile, stats } from '../lib/content';
import { Group, Page } from '../components/ui';

const actions = [
  { label: 'call', icon: <Phone size={20} strokeWidth={2.2} />, href: profile.phoneHref },
  { label: 'mail', icon: <Mail size={20} strokeWidth={2.2} />, href: `mailto:${profile.email}` },
  { label: 'GitHub', icon: <GitHubMark size={20} />, href: profile.github, external: true },
  { label: 'LinkedIn', icon: <LinkedInMark size={19} />, href: profile.linkedin, external: true },
];

export function About() {
  return (
    <Page title="About" inlineTitle>
      <div className="contact-hero">
        <img className="contact-photo" src={profile.photo} alt={profile.name} width={132} height={132} />
        <h2 className="contact-name">{profile.name}</h2>
        <p className="contact-role">{profile.role}</p>
        <div className="contact-actions">
          {actions.map((a) => (
            <a
              key={a.label}
              className="contact-action"
              href={a.href}
              {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {a.icon}
              <span>{a.label}</span>
            </a>
          ))}
        </div>
      </div>

      <Group>
        <p className="prose prose-lead">{profile.headline}</p>
      </Group>

      <Group plain>
        <div className="stat-tiles">
          {stats.map((s) => (
            <div key={s.label} className="stat-tile">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group header="Origins">
        <p className="prose">{about.origins}</p>
      </Group>

      <Group header="Philosophy">
        <p className="prose">{about.philosophy}</p>
      </Group>

      <Group header="Contact">
        <a className="row row-pressable" href={`mailto:${profile.email}`}>
          <span className="row-main">
            <span className="row-text">
              <span className="row-subtitle">email</span>
              <span className="row-title row-link">{profile.email}</span>
            </span>
          </span>
        </a>
        <a className="row row-pressable" href={profile.phoneHref}>
          <span className="row-main">
            <span className="row-text">
              <span className="row-subtitle">mobile</span>
              <span className="row-title row-link">{profile.phone}</span>
            </span>
          </span>
        </a>
        <div className="row">
          <span className="row-main">
            <span className="row-text">
              <span className="row-subtitle">based in</span>
              <span className="row-title">{profile.location}</span>
            </span>
          </span>
        </div>
      </Group>
    </Page>
  );
}
