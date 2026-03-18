import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Sensor } from './api';

// Composant de présentation : il ne gère que l'affichage
interface SensorMapProps {
  sensors: Sensor[];
}

function SensorMap({ sensors }: SensorMapProps) {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <h1 style={{ position: 'absolute', zIndex: 1000, background: 'white', padding: '10px', margin: '10px', borderRadius: '5px' }}>
        Carte des Capteurs (San Francisco) - {sensors.length} capteurs chargés
      </h1>
      
      <MapContainer 
        center={[37.35, -121.95]} 
        zoom={10} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {sensors.map((sensor) => (
          <Marker 
            key={sensor.sensor_id} 
            position={[sensor.latitude, sensor.longitude]}
          >
            <Popup>
              <strong>Capteur ID:</strong> {sensor.sensor_id} <br />
              <strong>Lat:</strong> {sensor.latitude.toFixed(4)} <br />
              <strong>Lng:</strong> {sensor.longitude.toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default SensorMap;
