import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

// Corregir icono predeterminado de Leaflet para Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Componente para re-centrar el mapa cuando cambian las coordenadas
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Marcador interactivo
function LocationMarker({ position, setPosition, onCoordinatesChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      if (onCoordinatesChange) {
        onCoordinatesChange(lat, lng);
      }
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          if (onCoordinatesChange) {
            onCoordinatesChange(lat, lng);
          }
        },
      }}
    />
  ) : null;
}

export default function LocationPicker({ 
  value = '', 
  location = '', 
  onChange, 
  onLocationChange, 
  onCoordinatesChange 
}) {
  // Manejo flexible de props para compatibilidad entre value/location
  const addressValue = value || location || '';
  
  const handleAddressUpdate = (newAddress) => {
    if (onChange) {
      onChange({ address: newAddress, lat: position[0], lng: position[1] });
    }
    if (onLocationChange) {
      onLocationChange(newAddress);
    }
  };

  const handleCoordsUpdate = (lat, lng) => {
    if (onChange) {
      onChange({ address: addressValue, lat, lng });
    }
    if (onCoordinatesChange) {
      onCoordinatesChange(lat, lng);
    }
  };

  // Coordenadas por defecto (CABA / Buenos Aires)
  const defaultCenter = [-34.6037, -58.3816];
  const [position, setPosition] = useState(defaultCenter);
  const [searching, setSearching] = useState(false);

  // Buscar dirección con la API de OpenStreetMap (Nominatim)
  const handleSearchAddress = async () => {
    if (!addressValue) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressValue)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const newCoords = [lat, lon];
        
        setPosition(newCoords);
        handleCoordsUpdate(lat, lon);
      }
    } catch (error) {
      console.error('Error al geolocalizar la dirección:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={addressValue}
          onChange={(e) => handleAddressUpdate(e.target.value)}
          placeholder="Ej: Av. Cabildo 2000, Belgrano, CABA"
          /* SE ELIMINÓ EL ATRIBUTO required AQUÍ */
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleSearchAddress}
          disabled={searching || !addressValue}
          className="shrink-0"
        >
          <Search className="w-4 h-4 mr-2" />
          {searching ? 'Buscando...' : 'Buscar en Mapa'}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        Puedes hacer clic o arrastrar el pin rojo en el mapa para fijar la ubicación exacta.
      </p>

      {/* Contenedor del Mapa */}
      <div className="w-full h-64 rounded-xl overflow-hidden border border-border relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onCoordinatesChange={(lat, lng) => handleCoordsUpdate(lat, lng)}
          />
        </MapContainer>
      </div>
    </div>
  );
}