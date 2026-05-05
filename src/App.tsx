import { Desk } from './components/Desk';
import { StatusBar } from './components/StatusBar';
import { Wallpaper } from './components/Wallpaper';
import { DEVICE, useDeviceScale } from './lib/hooks';

export default function App() {
  const scale = useDeviceScale(true);

  return (
    <Desk scale={scale} device={DEVICE} onSideButton={() => {}} locked={false}>
      <div className="screen">
        <Wallpaper />
        <StatusBar tone="light" />
      </div>
    </Desk>
  );
}
