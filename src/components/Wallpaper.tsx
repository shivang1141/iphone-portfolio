export function Wallpaper({ dimmed }: { dimmed?: boolean }) {
  return <div className="wallpaper" data-dimmed={dimmed || undefined} aria-hidden />;
}
