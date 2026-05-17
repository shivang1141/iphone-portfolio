import { Printer } from 'lucide-react';
import { createPortal } from 'react-dom';
import { about, education, experience, profile, projects, skills } from '../lib/content';
import { Page } from '../components/ui';

export function Resume() {
  return (
    <Page
      title="Resume"
      inlineTitle
      trailing={
        <button
          type="button"
          className="glass-button"
          onClick={() => window.print()}
          aria-label="Print or save as PDF"
        >
          <Printer size={19} strokeWidth={2.2} />
        </button>
      }
    >
      <div className="paper-wrap">
        <ResumeDocument />
      </div>
      <p className="group-footer paper-footer">Tap the printer to save it as a PDF.</p>
    </Page>
  );
}

/** The document itself — rendered inside the phone and, separately, for print. */
export function ResumeDocument() {
  return (
    <article className="paper">
      <header className="paper-head">
        <h2>{profile.name}</h2>
        <p>
          {profile.email} · {profile.phone} · {profile.location}
        </p>
        <p>
          github.com/shivang1141 · linkedin.com/in/shivangpatel-uml
        </p>
      </header>

      <p className="paper-summary">{profile.headline}</p>

      <section>
        <h3>Education</h3>
        {education.map((e) => (
          <div key={e.school} className="paper-item">
            <div className="paper-line">
              <strong>{e.school}</strong>
              <span>{e.date}</span>
            </div>
            <div className="paper-line paper-sub">
              <span>
                {e.degree}
                {e.minor ? `, ${e.minor}` : ''}
              </span>
              <span>{e.location}</span>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h3>Experience</h3>
        {experience.map((j) => (
          <div key={j.company} className="paper-item">
            <div className="paper-line">
              <strong>{j.title}</strong>
              <span>{j.period}</span>
            </div>
            <div className="paper-line paper-sub">
              <span>{j.company}</span>
              <span>{j.location}</span>
            </div>
            <ul>
              <li>{j.description}</li>
              {j.achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3>Projects</h3>
        {projects.map((p) => (
          <div key={p.id} className="paper-item">
            <div className="paper-line">
              <strong>{p.title}</strong>
              <span className="paper-tags">{p.tags.slice(0, 4).join(', ')}</span>
            </div>
            <p className="paper-text">{p.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Skills</h3>
        {skills.map((c) => (
          <p key={c.title} className="paper-text">
            <strong>{c.title}:</strong> {c.skills.join(', ')}
          </p>
        ))}
      </section>

      <section>
        <h3>About</h3>
        <p className="paper-text">{about.philosophy}</p>
      </section>
    </article>
  );
}

/** Lives outside the phone so Ctrl+P / the printer button always prints a clean resume. */
export function PrintableResume() {
  return createPortal(
    <div className="print-only">
      <ResumeDocument />
    </div>,
    document.body,
  );
}
