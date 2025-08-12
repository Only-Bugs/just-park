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

interface Props {
  spots: ParkingSpot[];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  onSpotClick: (spot: ParkingSpot) => void;
  searchLocation?: { lat: number; lng: number } | null;
  selectedSpotId?: string | null; // Add selected spot ID
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
            <Popup>
              <div style={{ textAlign: "center", minWidth: "150px" }}>
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        spot.status === "Unoccupied" ? "#dcfce7" : "#fee2e2",
                      color:
                        spot.status === "Unoccupied" ? "#166534" : "#991b1b",
                      fontWeight: "600",
                      fontSize: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    {spot.status}
                  </div>
                  <br />
                  <strong>Zone:</strong> {spot.zone || "N/A"}
                  {spot.primaryRule && (
                    <>
                      <br />
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {spot.primaryRule}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`,
                      "_blank"
                    );
                  }}
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    width: "100%",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#1565c0";
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#1976d2";
                  }}
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
