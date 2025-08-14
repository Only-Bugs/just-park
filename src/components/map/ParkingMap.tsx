import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CircularProgress } from "@mui/material";
import type { ParkingSpot } from "../../types/parking";
import { createPopupContent, leafletPopupCSS } from "./styles/popupStyles";

interface Props {
  spots: ParkingSpot[];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  onSpotClick: (spot: ParkingSpot) => void;
  searchLocation?: { lat: number; lng: number } | null;
  selectedSpotId?: string | null;
}

// Enhanced marker creation function
const createEnhancedMarker = (
  spot: ParkingSpot,
  isSelected: boolean = false
) => {
  const isAvailable = spot.status === "Unoccupied";
  const size = isSelected ? 20 : 16;
  const borderSize = isSelected ? 3 : 2;

  // Enhanced colors with better contrast
  const backgroundColor = isAvailable ? "#22c55e" : "#ef4444";
  const borderColor = isSelected ? "#1f2937" : "#ffffff";
  const shadowColor = isSelected ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)";

  return L.divIcon({
    className: "custom-parking-marker",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background: ${backgroundColor};
        border: ${borderSize}px solid ${borderColor};
        border-radius: 50%;
        box-shadow: 0 2px 8px ${shadowColor};
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${size - 8}px;
          height: ${size - 8}px;
          background: ${isAvailable ? "#16a34a" : "#dc2626"};
          border-radius: 50%;
          ${
            isSelected
              ? `
            animation: pulse 1.5s infinite;
          `
              : ""
          }
        "></div>
        ${
          isSelected
            ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${size + 10}px;
            height: ${size + 10}px;
            border: 2px solid ${backgroundColor};
            border-radius: 50%;
            opacity: 0.6;
            animation: ripple 2s infinite;
          "></div>
        `
            : ""
        }
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes ripple {
          0% { 
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }
        .custom-parking-marker:hover div:first-child {
          transform: translate(-50%, -50%) scale(1.2);
        }
      </style>
    `,
    iconSize: [size + 10, size + 10],
    iconAnchor: [(size + 10) / 2, (size + 10) / 2],
  });
};

export default function ParkingMap({
  spots,
  onBoundsChange,
  onSpotClick,
  searchLocation,
  selectedSpotId,
}: Props) {
  const center: [number, number] = [-37.8136, 144.9631];

  return (
    <>
      {/* Custom CSS for Leaflet popup styling */}
      <style>{leafletPopupCSS}</style>

      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <InnerMap
          spots={spots}
          onBoundsChange={onBoundsChange}
          onSpotClick={onSpotClick}
          searchLocation={searchLocation}
          selectedSpotId={selectedSpotId}
        />
      </MapContainer>
    </>
  );
}

function InnerMap({
  spots,
  onBoundsChange,
  onSpotClick,
  searchLocation,
  selectedSpotId,
}: {
  spots: ParkingSpot[];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  onSpotClick: (spot: ParkingSpot) => void;
  searchLocation?: { lat: number; lng: number } | null;
  selectedSpotId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (searchLocation) {
      map.flyTo([searchLocation.lat, searchLocation.lng], 18, {
        duration: 1.5,
      });
    }
  }, [searchLocation, map]);

  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange(bounds);
    },
  });

  if (!spots) return <CircularProgress />;

  return (
    <>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((spot) => {
        const isSelected = selectedSpotId === spot.id;

        return (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={createEnhancedMarker(spot, isSelected)}
            eventHandlers={{
              click: () => onSpotClick(spot),
            }}
          >
            <Popup
              className="custom-popup"
              closeButton={true}
              autoClose={false}
              closeOnEscapeKey={true}
              autoPan={true} // Automatically pan map to keep popup in view
              autoPanPadding={[20, 20]} // Padding around popup when auto-panning
              keepInView={true} // Keep popup in view when map bounds change
              offset={[0, -20]} // This pushes the popup up so it doesn't hide the marker
            >
              <div
                dangerouslySetInnerHTML={{ __html: createPopupContent(spot) }}
              />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
