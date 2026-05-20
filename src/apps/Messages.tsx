import { ArrowUp, Copy, Mail, Phone } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { LinkedInMark } from '../lib/apps';
import { profile } from '../lib/content';
import { formatTime, useClock } from '../lib/hooks';
import { useOS } from '../lib/os';

type Sent = { id: number; from: 'me' | 'them'; text: string };

export function Messages() {
  const { notify, reduceMotion } = useOS();
  const now = useClock();
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Sent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    if (!sent.length) return;
    const el = scrollRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [sent, reduceMotion]);

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    setSent((s) => [...s, { id: nextId.current++, from: 'me', text }]);
    notify({ icon: <Mail size={18} strokeWidth={2.4} />, title: 'Opening Mail', detail: 'Your message is ready to send' });
    const subject = encodeURIComponent('Hello from your portfolio');
    window.setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
    }, 450);
    window.setTimeout(() => {
      setSent((s) => [
        ...s,
        {
          id: nextId.current++,
          from: 'them',
          text: 'Thanks! Your mail app should open with that message — just hit send and it’ll reach me. 🙌',
        },
      ]);
    }, 1200);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      notify({ icon: <Copy size={17} strokeWidth={2.4} />, title: 'Email copied', detail: profile.email });
    } catch {
      notify({ icon: <Mail size={17} strokeWidth={2.4} />, title: profile.email });
    }
  }

  let i = 0;
  const stagger = () => ({ '--i': i++ }) as CSSProperties;

  return (
    <div className="messages">
      <header className="conv-head">
        <div className="navbar-material" aria-hidden />
        <img className="conv-avatar" src={profile.photo} alt="" width={52} height={52} />
        <h2 className="conv-name">{profile.firstName}</h2>
      </header>

      <div className="conv-scroll" ref={scrollRef}>
        <p className="conv-stamp">
          iMessage
          <br />
          Today {formatTime(now)}
        </p>

        <div className="bubbles">
          <p className="bubble them" style={stagger()}>
            Hey! I’m Shivang 👋
          </p>
          <p className="bubble them" style={stagger()}>
            {profile.tagline}
          </p>
          <p className="bubble them tail" style={stagger()}>
            Right now I’m pursuing my MS in Artificial Intelligence at UT Austin.
          </p>

          <div className="bubble-cards" style={stagger()}>
            <div className="link-card">
              <a className="link-card-main" href={`mailto:${profile.email}`}>
                <span className="link-card-icon" style={{ background: '#0a84ff' }}>
                  <Mail size={18} strokeWidth={2.2} />
                </span>
                <span className="link-card-text">
                  <span className="link-card-title">Email</span>
                  <span className="link-card-sub">{profile.email}</span>
                </span>
              </a>
              <button type="button" className="link-card-copy" onClick={copyEmail} aria-label="Copy email address">
                <Copy size={16} strokeWidth={2.2} />
              </button>
            </div>
            <a className="link-card link-card-main" href={profile.phoneHref}>
              <span className="link-card-icon" style={{ background: '#34c759' }}>
                <Phone size={18} strokeWidth={2.2} />
              </span>
              <span className="link-card-text">
                <span className="link-card-title">Phone</span>
                <span className="link-card-sub">{profile.phone}</span>
              </span>
            </a>
            <a className="link-card link-card-main" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <span className="link-card-icon" style={{ background: '#0a66c2' }}>
                <LinkedInMark size={17} />
              </span>
              <span className="link-card-text">
                <span className="link-card-title">LinkedIn</span>
                <span className="link-card-sub">in/shivangpatel-uml</span>
              </span>
            </a>
          </div>

          <p className="bubble them tail" style={stagger()}>
            Or type below — it opens in your mail app, ready to send.
          </p>

          {sent.map((m) => (
            <p key={m.id} className={`bubble tail ${m.from} bubble-new`}>
              {m.text}
            </p>
          ))}
        </div>
      </div>

      <form className="composer" onSubmit={send}>
        <label className="visually-hidden" htmlFor="composer-input">
          Message to {profile.firstName}
        </label>
        <div className="composer-field">
          <input
            id="composer-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="iMessage"
            autoComplete="off"
            enterKeyHint="send"
          />
          <button type="submit" className="composer-send" data-ready={draft.trim() ? true : undefined} aria-label="Send">
            <ArrowUp size={18} strokeWidth={2.8} />
          </button>
        </div>
      </form>
    </div>
  );
}
