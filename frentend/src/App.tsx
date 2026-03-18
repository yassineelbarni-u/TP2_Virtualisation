import { useEffect, useState } from 'react';
import { fetchSensors } from './api';
import type { Sensor } from './api';
import SensorMap from './SensorMap.tsx';

function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  //useEffect s’execute automatiquement
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchSensors();
      setSensors(data);
    };
    loadData();
 // execute une fois au montage du composant
  }, []);

  // Vue delegue au composant de presentation
  return <SensorMap sensors={sensors} />;
}

export default App;