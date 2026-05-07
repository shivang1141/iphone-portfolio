import {
  Briefcase,
  Code2,
  FileText,
  GraduationCap,
  Mail,
  MessageCircle,
  Phone,
  Rocket,
  Settings as Gear,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { AppId } from './os';

type Glyph = LucideIcon | ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export type AppDef = {
  id: AppId;
  name: string;
  background: string;
  glyph: Glyph;
  glyphColor?: string;
  /** Background the window shows before its content has painted. */
  surface: 'grouped' | 'plain';
};

export function GitHubMark({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function LinkedInMark({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.81c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.89h-4v-11Z" />
    </svg>
  );
}

export const apps: Record<AppId, AppDef> = {
  about: {
    id: 'about',
    name: 'About',
    background: 'linear-gradient(180deg, #8e8cff 0%, #5e5ce6 55%, #4b3fd1 100%)',
    glyph: UserRound,
    surface: 'grouped',
  },
  experience: {
    id: 'experience',
    name: 'Experience',
    background: 'linear-gradient(180deg, #ffb340 0%, #ff8a00 60%, #f26b00 100%)',
    glyph: Briefcase,
    surface: 'grouped',
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    background: 'linear-gradient(180deg, #40c8ff 0%, #0a84ff 55%, #0060df 100%)',
    glyph: Rocket,
    surface: 'grouped',
  },
  skills: {
    id: 'skills',
    name: 'Skills',
    background: 'linear-gradient(180deg, #3a3a3c 0%, #1c1c1e 100%)',
    glyph: Code2,
    surface: 'grouped',
  },
  resume: {
    id: 'resume',
    name: 'Resume',
    background: 'linear-gradient(180deg, #ffffff 0%, #e9e9ee 100%)',
    glyph: FileText,
    glyphColor: '#ff9500',
    surface: 'grouped',
  },
  education: {
    id: 'education',
    name: 'Education',
    background: 'linear-gradient(180deg, #ff6b6b 0%, #ff375f 55%, #e0245e 100%)',
    glyph: GraduationCap,
    surface: 'grouped',
  },
  messages: {
    id: 'messages',
    name: 'Messages',
    background: 'linear-gradient(180deg, #6df07f 0%, #34c759 55%, #1fae45 100%)',
    glyph: MessageCircle,
    surface: 'plain',
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    background: 'linear-gradient(180deg, #b8b8be 0%, #8e8e93 60%, #6e6e73 100%)',
    glyph: Gear,
    surface: 'grouped',
  },
};

export type LinkDef = {
  id: string;
  name: string;
  href: string;
  background: string;
  glyph: Glyph;
  external?: boolean;
};

export const links: Record<'phone' | 'mail' | 'github' | 'linkedin', LinkDef> = {
  phone: {
    id: 'phone',
    name: 'Phone',
    href: 'tel:+18572649108',
    background: 'linear-gradient(180deg, #6df07f 0%, #34c759 55%, #1fae45 100%)',
    glyph: Phone,
  },
  mail: {
    id: 'mail',
    name: 'Mail',
    href: 'mailto:shivang.patel1141@gmail.com',
    background: 'linear-gradient(180deg, #5ac8fa 0%, #1a8cff 60%, #0a6cff 100%)',
    glyph: Mail,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    href: 'https://github.com/shivang1141',
    background: 'linear-gradient(180deg, #3a3a3c 0%, #111113 100%)',
    glyph: GitHubMark,
    external: true,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/shivangpatel-uml/',
    background: 'linear-gradient(180deg, #2a8ae6 0%, #0a66c2 100%)',
    glyph: LinkedInMark,
    external: true,
  },
};

/** The icon's artwork alone — reused on the home screen and inside the launch animation. */
export function IconArt({
  background,
  glyph: G,
  glyphColor = '#fff',
  size,
}: {
  background: string;
  glyph: Glyph;
  glyphColor?: string;
  size: number;
}) {
  return (
    <span
      className="icon-art"
      style={{ background, color: glyphColor, width: size, height: size, borderRadius: size * 0.225 }}
    >
      <G size={Math.round(size * 0.5)} strokeWidth={1.9} />
    </span>
  );
}
