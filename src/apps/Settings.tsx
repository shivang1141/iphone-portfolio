import { Accessibility, Code2, Contrast, Heart, Moon, Package, Sparkles } from 'lucide-react';
import { GitHubMark } from '../lib/apps';
import { profile } from '../lib/content';
import { useOS, type Theme } from '../lib/os';
import { Group, Page, Row, Segmented, Tile, Toggle } from '../components/ui';

export function Settings() {
  const { settings, setSettings } = useOS();
  return (
    <Page title="Settings">
      <Group>
        <div className="row account-row">
          <img className="account-photo" src={profile.photo} alt="" width={60} height={60} />
          <span className="row-main">
            <span className="row-text">
              <span className="account-name">{profile.name}</span>
              <span className="row-subtitle">{profile.role} · {profile.location}</span>
            </span>
          </span>
        </div>
      </Group>

      <Group header="Display">
        <Row
          icon={
            <Tile color="#5e5ce6">
              <Moon size={17} strokeWidth={2.2} color="#fff" />
            </Tile>
          }
          title="Appearance"
        />
        <div className="group-pad group-pad-tight">
          <Segmented<Theme>
            label="Appearance"
            value={settings.theme}
            onChange={(theme) => setSettings({ theme })}
            options={[
              { value: 'auto', label: 'Automatic' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </div>
      </Group>

      <Group
        header="Accessibility"
        footer="Reduce Motion swaps zooms and slides for gentle fades. Your device setting is always respected too."
      >
        <Row
          icon={
            <Tile color="#0a84ff">
              <Accessibility size={17} strokeWidth={2.2} color="#fff" />
            </Tile>
          }
          title="Reduce Motion"
          accessory={
            <Toggle
              label="Reduce Motion"
              checked={settings.reduceMotion}
              onChange={(reduceMotion) => setSettings({ reduceMotion })}
            />
          }
        />
        <Row
          icon={
            <Tile color="#8e8e93">
              <Contrast size={17} strokeWidth={2.2} color="#fff" />
            </Tile>
          }
          title="Reduce Transparency"
          accessory={
            <Toggle
              label="Reduce Transparency"
              checked={settings.reduceTransparency}
              onChange={(reduceTransparency) => setSettings({ reduceTransparency })}
            />
          }
        />
      </Group>

      <Group header="About This Site" footer={`© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`}>
        <Row
          icon={
            <Tile color="#30b0c7">
              <Code2 size={17} strokeWidth={2.2} color="#fff" />
            </Tile>
          }
          title="Built with"
          detail="React · Motion"
        />
        <Row
          icon={
            <Tile color="#ff9500">
              <Sparkles size={17} strokeWidth={2.2} color="#fff" />
            </Tile>
          }
          title="Design"
          detail="Inspired by iOS"
        />
        <Row
          icon={
            <Tile color="#34c759">
              <Package size={17} strokeWidth={2.2} color="#fff" />
            </Tile>
          }
          title="Version"
          detail="2026.10"
        />
        <Row
          icon={
            <Tile color="#1c1c1e">
              <GitHubMark size={17} color="#fff" />
            </Tile>
          }
          title="Source Code"
          href={profile.repo}
          external
        />
      </Group>

      <p className="made-with">
        Built with <Heart size={12} fill="currentColor" strokeWidth={0} aria-label="love" /> using React &amp; Motion
      </p>
    </Page>
  );
}
