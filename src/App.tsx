import { useState } from 'react';
import { Desk } from './components/Desk';
import { HomeScreen } from './components/HomeScreen';
import { LockScreen } from './components/LockScreen';
import { StatusBar } from './components/StatusBar';
import { DEVICE, useDeviceScale } from './lib/hooks';

export default function App() {
  const scale = useDeviceScale(true);
  const [locked, setLocked] = useState(true);
  const [homeEntered, setHomeEntered] = useState(false);

  return (
    <Desk scale={scale} device={DEVICE} onSideButton={() => setLocked(true)} locked={locked}>
      <div className="screen">
        <HomeScreen entered={homeEntered} inert={locked} onOpen={(id) => console.log('open', id)} />
        {locked && (
          <LockScreen
            height={852}
            scale={scale}
            enterFromTop={false}
            reduceMotion={false}
            onEntered={() => setHomeEntered(false)}
            onUnlockStart={() => setHomeEntered(true)}
            onUnlocked={() => setLocked(false)}
          />
        )}
        <StatusBar tone="light" hideTime={locked} />
      </div>
    </Desk>
  );
}
