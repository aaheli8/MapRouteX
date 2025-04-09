import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import axios from 'axios';

type LatLng = [number, number];

function App() {
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [manualOrigin, setManualOrigin] = useState({ lat: '', lng: '' });
  const [manualDestination, setManualDestination] = useState({ lat: '', lng: '' });

  const handleMapClick = (e: any) => {
    const latlng: LatLng = [e.latlng.lat, e.latlng.lng];
    if (!origin) setOrigin(latlng);
    else if (!destination) setDestination(latlng);
  };

  const fetchRoute = async () => {
    if (origin && destination) {
      try {
        const response = await axios.post('http://localhost:5000/route', {
          origin,
          destination,
        });
        setRoute(response.data.route);
      } catch (err) {
        console.error('Error fetching route:', err);
      }
    }
  };

  const handleManualInput = () => {
    const orig: LatLng = [parseFloat(manualOrigin.lat), parseFloat(manualOrigin.lng)];
    const dest: LatLng = [parseFloat(manualDestination.lat), parseFloat(manualDestination.lng)];
    setOrigin(orig);
    setDestination(dest);
  };

  const reset = () => {
    setOrigin(null);
    setDestination(null);
    setRoute([]);
    setManualOrigin({ lat: '', lng: '' });
    setManualDestination({ lat: '', lng: '' });
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* Map */}
      <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onClick={handleMapClick} />
        {origin && <Marker position={origin} />}
        {destination && <Marker position={destination} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>

      {/* Sidebar UI */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          width: '250px',
          zIndex: 1000,
        }}
      >
        <h3>Enter Origin</h3>
        <input
          type="text"
          placeholder="Latitude"
          value={manualOrigin.lat}
          onChange={(e) => setManualOrigin({ ...manualOrigin, lat: e.target.value })}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={manualOrigin.lng}
          onChange={(e) => setManualOrigin({ ...manualOrigin, lng: e.target.value })}
        />

        <h3>Enter Destination</h3>
        <input
          type="text"
          placeholder="Latitude"
          value={manualDestination.lat}
          onChange={(e) => setManualDestination({ ...manualDestination, lat: e.target.value })}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={manualDestination.lng}
          onChange={(e) => setManualDestination({ ...manualDestination, lng: e.target.value })}
        />

        <div style={{ marginTop: '10px' }}>
          <button onClick={handleManualInput} style={{ marginRight: '10px' }}>Set</button>
          <button onClick={fetchRoute} style={{ marginRight: '10px' }}>Search</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

function MapClickHandler({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({
    click(e) {
      onClick(e);
    },
  });
  return null;
}

export default App;
