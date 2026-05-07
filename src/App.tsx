import { Desk } from './components/Desk';
import { HomeScreen } from './components/HomeScreen';
import { StatusBar } from './components/StatusBar';
import { DEVICE, useDeviceScale } from './lib/hooks';

export default function App() {
  const scale = useDeviceScale(true);

  return (
    <Desk scale={scale} device={DEVICE} onSideButton={() => {}} locked={false}>
      <div className="screen">
        <HomeScreen entered inert={false} onOpen={(id) => console.log('open', id)} />
        <StatusBar tone="light" />
      </div>
    </Desk>
  );
}
