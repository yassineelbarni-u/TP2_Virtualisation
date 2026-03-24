import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
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
          <CircleMarker
            key={sensor.sensor_id}
            center={[sensor.latitude, sensor.longitude]}
            radius={5}
            pathOptions={{
              fillColor: '#3388ff',
              fillOpacity: 0.7,
              color: '#2c5aa0',
              weight: 1
            }}
          >
            <Popup>
              <strong>Capteur ID:</strong> {sensor.sensor_id} <br />
              <strong>Lat:</strong> {sensor.latitude.toFixed(4)} <br />
              <strong>Lng:</strong> {sensor.longitude.toFixed(4)}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default SensorMap;
