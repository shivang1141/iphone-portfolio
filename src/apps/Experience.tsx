import { Calendar, CheckCircle2, MapPin } from 'lucide-react';
import { experience } from '../lib/content';
import { Chips, Group, Page } from '../components/ui';

export function Experience() {
  return (
    <Page title="Experience">
      {experience.map((job) => (
        <div key={job.company} className="job">
          <Group plain>
            <article className="job-card">
              <div className="job-head">
                <span className="job-logo" aria-hidden>
                  {job.monogram}
                </span>
                <div className="job-heading">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>
              </div>
              <div className="job-meta">
                <span>
                  <Calendar size={14} strokeWidth={2.2} aria-hidden /> {job.period}
                </span>
                <span>
                  <MapPin size={14} strokeWidth={2.2} aria-hidden /> {job.location}
                </span>
              </div>
              <p className="prose">{job.description}</p>
            </article>
          </Group>

          <Group header="Key Achievements">
            {job.achievements.map((a) => (
              <div key={a} className="row row-top">
                <span className="row-icon row-icon-plain" aria-hidden>
                  <CheckCircle2 size={20} strokeWidth={2.2} />
                </span>
                <span className="row-main">
                  <span className="row-text">
                    <span className="row-body">{a}</span>
                  </span>
                </span>
              </div>
            ))}
          </Group>

          <Group header="Technologies">
            <div className="group-pad">
              <Chips items={job.technologies} />
            </div>
          </Group>
        </div>
      ))}
    </Page>
  );
}
