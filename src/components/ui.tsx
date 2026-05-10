import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useRef, useState, type ReactNode, type UIEvent } from 'react';
import { springs, useBackHandler, useOS } from '../lib/os';

type PageProps = {
  title: string;
  /** Small caps line above the large title, like the App Store's date. */
  eyebrow?: string;
  /** Hide the large title and show the inline title right away. */
  inlineTitle?: boolean;
  /** Inline title that only fades in once the page's own heading scrolls away. */
  revealTitleAt?: number;
  onBack?: () => void;
  trailing?: ReactNode;
  children: ReactNode;
};

export function Page({ title, eyebrow, inlineTitle, revealTitleAt, onBack, trailing, children }: PageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const scrolledRef = useRef(false);
  const revealedRef = useRef(false);
  const inline = inlineTitle || revealTitleAt !== undefined;

  // Only re-render when a threshold is crossed, never per scroll frame.
  function onScroll(e: UIEvent<HTMLDivElement>) {
    const top = e.currentTarget.scrollTop;
    const nextScrolled = top > (inline ? 4 : 44);
    if (nextScrolled !== scrolledRef.current) {
      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    }
    if (revealTitleAt !== undefined) {
      const nextRevealed = top > revealTitleAt;
      if (nextRevealed !== revealedRef.current) {
        revealedRef.current = nextRevealed;
        setRevealed(nextRevealed);
      }
    }
  }

  const titleShown = revealTitleAt !== undefined ? revealed : inlineTitle || scrolled;

  return (
    <div className="page">
      <header
        className="navbar"
        data-scrolled={scrolled || undefined}
        data-title-shown={titleShown || undefined}
      >
        <div className="navbar-material" aria-hidden />
        <div className="navbar-side">
          {onBack && (
            <button type="button" className="glass-button" onClick={onBack} aria-label="Back">
              <ChevronLeft size={22} strokeWidth={2.4} />
            </button>
          )}
        </div>
        <p className="navbar-title" aria-hidden={!titleShown}>
          {title}
        </p>
        <div className="navbar-side navbar-trailing">{trailing}</div>
      </header>
      <div className="page-scroll" onScroll={onScroll}>
        {!inline && (
          <div className="large-title-wrap">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="large-title">{title}</h2>
          </div>
        )}
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}

/** A navigation stack with one optional pushed view, like UINavigationController. */
export function Stack({
  detail,
  detailKey,
  onBack,
  children,
}: {
  detail: ReactNode | null;
  detailKey?: string;
  onBack: () => void;
  children: ReactNode;
}) {
  const { reduceMotion } = useOS();
  useBackHandler(onBack, !!detail);
  const pushed = !!detail;

  return (
    <div className="stack">
      <motion.div
        className="stack-view"
        inert={pushed}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: pushed ? 0 : 1 }
            : { transform: pushed ? 'translateX(-28%)' : 'translateX(0%)', opacity: 1 }
        }
        transition={reduceMotion ? { duration: 0.2 } : springs.push}
      >
        {children}
      </motion.div>
      <AnimatePresence initial={false}>
        {detail && (
          <motion.div
            key={detailKey}
            className="stack-view stack-detail"
            initial={reduceMotion ? { opacity: 0 } : { transform: 'translateX(100%)' }}
            animate={reduceMotion ? { opacity: 1 } : { transform: 'translateX(0%)' }}
            exit={reduceMotion ? { opacity: 0 } : { transform: 'translateX(100%)' }}
            transition={reduceMotion ? { duration: 0.2 } : springs.push}
          >
            {detail}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Group({
  header,
  footer,
  children,
  plain,
}: {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** No card background — for content that brings its own surface. */
  plain?: boolean;
}) {
  return (
    <section className="group">
      {header && <h3 className="group-header">{header}</h3>}
      <div className={plain ? 'group-plain' : 'group-card'}>{children}</div>
      {footer && <p className="group-footer">{footer}</p>}
    </section>
  );
}

type RowProps = {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  accessory?: ReactNode;
};

export function Row({ icon, title, subtitle, detail, href, external, onClick, accessory }: RowProps) {
  const inner = (
    <>
      {icon && <span className="row-icon">{icon}</span>}
      <span className="row-main">
        <span className="row-text">
          <span className="row-title">{title}</span>
          {subtitle && <span className="row-subtitle">{subtitle}</span>}
        </span>
        {detail && <span className="row-detail">{detail}</span>}
        {accessory}
        {href && external && <ArrowUpRight className="row-chevron" size={17} strokeWidth={2.2} aria-hidden />}
        {(onClick || (href && !external)) && (
          <ChevronRight className="row-chevron" size={17} strokeWidth={2.4} aria-hidden />
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a className="row row-pressable" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" className="row row-pressable" onClick={onClick}>
        {inner}
      </button>
    );
  }
  return <div className="row">{inner}</div>;
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="chips">
      {items.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="toggle"
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-thumb" />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="segmented" role="radiogroup" aria-label={label} style={{ ['--count' as string]: options.length }}>
      <span
        className="segmented-thumb"
        aria-hidden
        style={{ transform: `translateX(${index * 100}%)`, width: `calc((100% - 4px) / ${options.length})` }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className="segmented-option"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Rounded square used as a row or section icon, like Settings. */
export function Tile({ color, children, size = 30 }: { color: string; children: ReactNode; size?: number }) {
  return (
    <span className="tile" style={{ background: color, width: size, height: size, borderRadius: size * 0.27 }}>
      {children}
    </span>
  );
}
