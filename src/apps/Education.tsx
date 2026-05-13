import { Calendar, MapPin } from 'lucide-react';
import { education } from '../lib/content';
import { Group, Page } from '../components/ui';

export function Education() {
  return (
    <Page title="Education">
      {education.map((e) => (
        <Group key={e.school} plain>
          <article className="school-card">
            <span className="school-mark" style={{ background: e.color }} aria-hidden>
              {e.monogram}
            </span>
            <h3 className="school-name">{e.school}</h3>
            <p className="school-degree">{e.degree}</p>
            {e.minor && <p className="school-minor">{e.minor}</p>}
            <div className="job-meta">
              <span>
                <Calendar size={14} strokeWidth={2.2} aria-hidden /> {e.date}
              </span>
              <span>
                <MapPin size={14} strokeWidth={2.2} aria-hidden /> {e.location}
              </span>
            </div>
          </article>
        </Group>
      ))}
    </Page>
  );
}
