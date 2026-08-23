"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onSelect: (latitude: number, longitude: number) => void;
}

const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({
  onSelect,
}: {
  onSelect: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect(
        event.latlng.lat,
        event.latlng.lng,
      );
    },
  });

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onSelect,
}: LocationPickerProps) {
  const [center, setCenter] = useState<[number, number]>([
    22.5726,
    88.3639,
  ]);

  useEffect(() => {
    if (
      latitude !== null &&
      longitude !== null &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      setCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom
        className="h-[350px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onSelect={onSelect} />

        {latitude !== null &&
          longitude !== null && (
            <Marker
              position={[latitude, longitude]}
              icon={markerIcon}
            />
          )}
      </MapContainer>
    </div>
  );
}