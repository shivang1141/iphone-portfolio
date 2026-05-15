import { ArrowUpRight, Play } from 'lucide-react';
import { useState } from 'react';
import { GitHubMark } from '../lib/apps';
import { profile, projects, type Project } from '../lib/content';
import { formatDate, useClock } from '../lib/hooks';
import { Chips, Group, Page, Row, Stack } from '../components/ui';

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const now = useClock();

  return (
    <Stack
      detail={selected && <ProjectDetail project={selected} onBack={() => setSelected(null)} />}
      detailKey={selected?.id}
      onBack={() => setSelected(null)}
    >
      <Page title="Projects" eyebrow={formatDate(now)}>
        <div className="today">
          {projects.map((p) => (
            <button key={p.id} type="button" className="today-card" onClick={() => setSelected(p)}>
              <span className="today-media">
                <img src={p.image} alt="" loading="lazy" />
              </span>
              <span className="today-text">
                <span className="today-category">{p.category}</span>
                <span className="today-title">{p.title}</span>
                <span className="today-summary">{p.summary}</span>
              </span>
            </button>
          ))}
        </div>
        <Group>
          <Row
            icon={<GitHubMark size={22} />}
            title="More on GitHub"
            subtitle="github.com/shivang1141"
            href={profile.github}
            external
          />
        </Group>
      </Page>
    </Stack>
  );
}

function ProjectDetail({ project: p, onBack }: { project: Project; onBack: () => void }) {
  return (
    <Page title={p.title} revealTitleAt={300} onBack={onBack}>
      <div className="detail-media">
        <img src={p.image} alt={`${p.title} screenshot`} />
      </div>
      <div className="detail-head">
        <p className="today-category">{p.category}</p>
        <h2 className="detail-title">{p.title}</h2>
        <p className="detail-summary">{p.summary}</p>
        <div className="detail-actions">
          <a className="capsule capsule-primary" href={p.github} target="_blank" rel="noopener noreferrer">
            <GitHubMark size={16} /> View Code
          </a>
          {p.live && (
            <a className="capsule" href={p.live.href} target="_blank" rel="noopener noreferrer">
              {p.live.label === 'Watch Video' ? (
                <Play size={15} strokeWidth={2.4} fill="currentColor" />
              ) : (
                <ArrowUpRight size={16} strokeWidth={2.4} />
              )}
              {p.live.label}
            </a>
          )}
        </div>
      </div>
      <Group header="About this project">
        <p className="prose">{p.description}</p>
      </Group>
      <Group header="Built with">
        <div className="group-pad">
          <Chips items={p.tags} />
        </div>
      </Group>
    </Page>
  );
}
