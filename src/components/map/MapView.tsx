import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { ParkingSpot } from "../../types/parking";
import { getMarkerColor } from "../../utils/parkingUtils";
import {
  interpretParkingRule,
  formatDays,
  formatTime,
  getRestrictionsForCurrentTime,
} from "../../types/parking";
import L from "leaflet";

type Props = {
  data: ParkingSpot[];
  showAvailableOnly: boolean;
  onSelectSpot: (spot: ParkingSpot) => void;
};

export default function MapView({
  data,
  showAvailableOnly,
  onSelectSpot,
}: Props) {
  const center: [number, number] = [-37.8136, 144.9631];
  const filtered = showAvailableOnly
    ? data.filter((spot) => spot.status === "Unoccupied")
    : data;

  // Enhanced popup content with parking sign styling
  const createPopupContent = (spot: ParkingSpot) => {
    const isAvailable = spot.status === "Unoccupied";
    const currentRestrictions = getRestrictionsForCurrentTime(
      spot.restrictions || []
    );
    const primaryRestriction =
      spot.currentRestriction || currentRestrictions[0];
    const isEconomical = !spot.restrictions || spot.restrictions.length === 0;

    return `
      <div style="
        font-family: system-ui, -apple-system, sans-serif;
        min-width: 280px;
        max-width: 320px;
        padding: 0;
        margin: -12px;
        border-radius: 16px;
        overflow: hidden;
        background: white;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      ">
        <!-- Status Badge -->
        <div style="
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
        ">
          <span style="
            background: ${isAvailable ? "#22c55e" : "#ef4444"};
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          ">
            ${isAvailable ? "Unoccupied" : "Occupied"}
          </span>
        </div>

        <!-- Parking Sign -->
        <div style="
          height: 120px;
          background: ${
            primaryRestriction
              ? "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
              : isEconomical
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : "linear-gradient(135deg, #666 0%, #555 100%)"
          };
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 8px;
        ">
          <!-- Status Dot -->
          <div style="
            position: absolute;
            top: 12px;
            left: 12px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${isAvailable ? "#22c55e" : "#ef4444"};
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          "></div>

          ${
            primaryRestriction
              ? `
            <div style="
              font-size: 2.5rem;
              font-weight: 900;
              line-height: 0.8;
              margin-bottom: 8px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              ${
                primaryRestriction.Rule?.includes("2P")
                  ? "2P"
                  : primaryRestriction.Rule?.includes("1P")
                  ? "1P"
                  : primaryRestriction.Rule?.includes("30")
                  ? "30M"
                  : primaryRestriction.Rule?.includes("4P")
                  ? "4P"
                  : primaryRestriction.Rule || "N/A"
              }
            </div>
            <div style="
              font-size: 0.8rem;
              font-weight: 600;
              text-align: center;
              line-height: 1.2;
              margin-bottom: 4px;
            ">
              ${formatTime(primaryRestriction.Start_Time || "").replace(
                " ",
                ""
              )} - 
              ${formatTime(primaryRestriction.End_Time || "").replace(" ", "")}
            </div>
            <div style="
              font-size: 0.65rem;
              font-weight: 500;
              text-align: center;
              opacity: 0.9;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            ">
              ${formatDays(primaryRestriction.Days || "")}
            </div>
          `
              : `
            <div style="
              font-size: 1.1rem;
              font-weight: 700;
              text-align: center;
              letter-spacing: 1px;
            ">
              NO RESTRICTIONS
            </div>
          `
          }

          <!-- Arrow pointer -->
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 6px solid ${
              primaryRestriction ? "#1565c0" : isEconomical ? "#16a34a" : "#555"
            };
          "></div>
        </div>

        <!-- Content -->
        <div style="padding: 16px 20px;">
          <!-- Spot Info -->
          <div style="margin-bottom: 16px;">
            <div style="
              font-size: 1.1rem;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 4px;
            ">
              Spot ${spot.id}
            </div>
            <div style="
              font-size: 0.9rem;
              color: #666;
              font-weight: 500;
            ">
              Zone: ${spot.zone || "N/A"}
            </div>
          </div>

          <!-- Expandable Details (if multiple restrictions) -->
          ${
            spot.restrictions && spot.restrictions.length > 1
              ? `
            <details style="margin-bottom: 16px;">
              <summary style="
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                color: #1976d2;
                padding: 8px 0;
                border-bottom: 1px solid #e0e0e0;
                outline: none;
                user-select: none;
              ">
                View All Restrictions (${spot.restrictions.length})
              </summary>
              <div style="padding-top: 12px;">
                ${spot.restrictions
                  .map(
                    (restriction, idx) => `
                  <div style="
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 3px solid #1976d2;
                  ">
                    <div style="
                      font-weight: 600;
                      font-size: 0.85rem;
                      color: #1a1a1a;
                      margin-bottom: 2px;
                    ">
                      ${interpretParkingRule(restriction.Rule)}
                    </div>
                    <div style="
                      font-size: 0.75rem;
                      color: #666;
                    ">
                      ${formatDays(restriction.Days)} • 
                      ${formatTime(restriction.Start_Time)} - 
                      ${formatTime(restriction.End_Time)}
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </details>
          `
              : ""
          }

          <!-- Action Button -->
          <button
            onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
              spot.lat
            },${spot.lng}', '_blank')"
            style="
              width: 100%;
              background: #1976d2;
              color: white;
              border: none;
              border-radius: 12px;
              padding: 14px 20px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
            "
            onmouseover="this.style.background='#1565c0'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(25, 118, 210, 0.4)'"
            onmouseout="this.style.background='#1976d2'; this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 12px rgba(25, 118, 210, 0.3)'"
          >
            Get Directions
          </button>
        </div>
      </div>
    `;
  };

  return (
    <>
      {/* Custom CSS for Leaflet popup styling */}
      <style>
        {`
          .custom-popup .leaflet-popup-content-wrapper {
            background: transparent !important;
            border-radius: 16px !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .custom-popup .leaflet-popup-content {
            margin: 0 !important;
            width: auto !important;
          }
          .custom-popup .leaflet-popup-tip-container {
            display: none !important;
          }
          .custom-popup .leaflet-popup-close-button {
            color: #666 !important;
            font-size: 18px !important;
            font-weight: bold !important;
            background: rgba(255,255,255,0.9) !important;
            border-radius: 50% !important;
            width: 28px !important;
            height: 28px !important;
            line-height: 28px !important;
            text-align: center !important;
            right: 8px !important;
            top: 8px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
          }
          .custom-popup .leaflet-popup-close-button:hover {
            background: rgba(255,255,255,1) !important;
            color: #333 !important;
          }
        `}
      </style>

      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={L.divIcon({
              className: "custom-icon",
              html: `<div style="background:${getMarkerColor(
                spot.status
              )};width:10px;height:10px;border-radius:50%"></div>`,
              iconSize: [10, 10],
              iconAnchor: [5, 5],
            })}
          >
            <Popup
              className="custom-popup"
              closeButton={true}
              autoClose={false}
              closeOnEscapeKey={true}
            >
              <div
                dangerouslySetInnerHTML={{ __html: createPopupContent(spot) }}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
