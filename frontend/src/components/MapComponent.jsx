import { useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useTheme } from '../contexts/ThemeContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const selectionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// The custom Google Maps-style Blue Dot
const liveLocationIcon = L.divIcon({
  className: 'bg-transparent',
  html: `
    <div class="relative flex items-center justify-center w-5 h-5">
      <span class="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
      <span class="relative inline-flex w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md"></span>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapEvents({ setClickedPos, setShowQuickBar }) {
  useMapEvents({
    click(e) {
      setClickedPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      setShowQuickBar(true);
    },
  });
  return null;
}

export default function MapComponent({ reports, userLocation, clickedPos, setClickedPos, setShowQuickBar }) {
  const { isDarkMode } = useTheme();
  const markerRef = useRef(null);

  const tileUrl = isDarkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setClickedPos({ lat: newPos.lat, lng: newPos.lng });
        }
      },
    }),
    [setClickedPos]
  );

  return (
    <MapContainer 
      center={userLocation ? [userLocation.lat, userLocation.lng] : [26.12878, 91.62180]} 
      zoom={15} 
      className="h-full w-full z-0"
    >
      <TileLayer
        key={tileUrl}
        attribution='&copy; CARTO'
        url={tileUrl}
      />
      
      <MapEvents setClickedPos={setClickedPos} setShowQuickBar={setShowQuickBar} />

      {/* Renders the new Blue Dot */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={liveLocationIcon}>
          <Popup className="font-bold text-blue-600">📍 You are here</Popup>
        </Marker>
      )}

      {clickedPos && (
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={[clickedPos.lat, clickedPos.lng]}
          icon={selectionIcon}
          ref={markerRef}
        >
          <Popup className="font-semibold text-teal-600">Drag to adjust exact location</Popup>
        </Marker>
      )}

      {reports?.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]}>
          <Popup>
            <strong className="capitalize">{report.type.replace('_', ' ')}</strong><br />
            {report.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}