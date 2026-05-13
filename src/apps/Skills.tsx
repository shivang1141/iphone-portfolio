import { BrainCircuit, Code2, Cpu, Server, Users, Wrench } from 'lucide-react';
import { skills, type SkillCategory } from '../lib/content';
import { Chips, Group, Page, Tile } from '../components/ui';

const icons: Record<SkillCategory['icon'], typeof Code2> = {
  frontend: Code2,
  backend: Server,
  embedded: Cpu,
  ml: BrainCircuit,
  tools: Wrench,
  soft: Users,
};

export function Skills() {
  return (
    <Page title="Skills">
      {skills.map((c) => {
        const Icon = icons[c.icon];
        return (
          <Group key={c.title}>
            <div className="row">
              <span className="row-icon">
                <Tile color={c.color}>
                  <Icon size={17} strokeWidth={2.2} color="#fff" />
                </Tile>
              </span>
              <span className="row-main">
                <span className="row-text">
                  <span className="row-title row-strong">{c.title}</span>
                </span>
                <span className="row-detail">{c.skills.length}</span>
              </span>
            </div>
            <div className="group-pad">
              <Chips items={c.skills} />
            </div>
          </Group>
        );
      })}
    </Page>
  );
}
