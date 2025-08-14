// src/components/map/styles/popupStyles.ts
import type { ParkingSpot } from "../../../types/parking";
import {
  interpretParkingRule,
  formatDays,
  formatTime,
  getRestrictionsForCurrentTime,
} from "../../../types/parking";

// Leaflet popup CSS styles
export const leafletPopupCSS = `
  .custom-popup .leaflet-popup-content-wrapper {
    background: transparent !important;
    border-radius: 16px !important;
    box-shadow: none !important;
    padding: 0 !important;
    pointer-events: auto !important;
  }
  .custom-popup .leaflet-popup-content {
    margin: 0 !important;
    width: auto !important;
    pointer-events: auto !important;
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
    pointer-events: auto !important;
  }
  .custom-popup .leaflet-popup-close-button:hover {
    background: rgba(255,255,255,1) !important;
    color: #333 !important;
  }
  .custom-popup {
    margin-bottom: 20px !important;
    pointer-events: auto !important;
  }
  
  /* Ensure popup content is interactive */
  .custom-popup * {
    pointer-events: auto !important;
  }
  
  /* Dynamic positioning classes */
  .leaflet-popup-content-wrapper {
    max-width: calc(100vw - 40px) !important;
    max-height: calc(100vh - 100px) !important;
    overflow-y: auto !important;
  }
  
  /* Responsive popup sizing */
  @media (max-width: 768px) {
    .custom-popup .leaflet-popup-content-wrapper {
      max-width: calc(100vw - 20px) !important;
    }
  }
`;

// Enhanced popup content with parking sign styling
export const createPopupContent = (spot: ParkingSpot): string => {
  const isAvailable = spot.status === "Unoccupied";
  const currentRestrictions = getRestrictionsForCurrentTime(
    spot.restrictions || []
  );
  const primaryRestriction = spot.currentRestriction || currentRestrictions[0];
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
      <div style="padding: 16px 20px; position: relative;">
        <!-- Expandable Details Toggle (if multiple restrictions) -->
        ${
          spot.restrictions && spot.restrictions.length > 1
            ? `
          <details style="margin-bottom: 12px;">
            <summary style="
              cursor: pointer;
              font-size: 0.9rem;
              font-weight: 600;
              color: #1976d2;
              outline: none;
              user-select: none;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              position: absolute;
              top: 16px;
              right: 20px;
              background: none;
              border: none;
              padding: 0;
              gap: 6px;
            ">
              <span class="toggle-text">More</span>
              <span style="
                font-size: 1rem;
                transition: transform 0.2s ease;
                transform: rotate(0deg);
                line-height: 1;
              ">▼</span>
            </summary>
            <div style="
              padding-top: 40px;
              margin-top: 8px;
            ">
              ${spot.restrictions
                .map(
                  (restriction, idx) => `
                <div style="
                  padding: 12px 16px;
                  margin-bottom: 8px;
                  background: linear-gradient(135deg, #f8f9ff 0%, #f1f3ff 100%);
                  border-radius: 12px;
                  border-left: 4px solid #1976d2;
                  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
                ">
                  <div style="
                    font-weight: 700;
                    font-size: 0.9rem;
                    color: #1a1a1a;
                    margin-bottom: 4px;
                  ">
                    ${interpretParkingRule(restriction.Rule)}
                  </div>
                  <div style="
                    font-size: 0.8rem;
                    color: #666;
                    font-weight: 500;
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
          <script>
            (function() {
              const details = document.querySelector('details');
              const toggleText = document.querySelector('.toggle-text');
              
              if (details && toggleText) {
                details.addEventListener('toggle', function() {
                  toggleText.textContent = details.open ? 'Less' : 'More';
                });
              }
            })();
          </script>
          <style>
            details[open] summary span:last-child {
              transform: rotate(180deg) !important;
            }
            details summary::marker {
              display: none;
            }
            details summary::-webkit-details-marker {
              display: none;
            }
          </style>
        `
            : ""
        }

        <!-- Action Button -->
        <button
          onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
            spot.lat
          },${spot.lng}', '_blank'); event.stopPropagation();"
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
            pointer-events: auto;
          "
          onmouseover="this.style.background='#1565c0'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(25, 118, 210, 0.4)'; event.stopPropagation();"
          onmouseout="this.style.background='#1976d2'; this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 12px rgba(25, 118, 210, 0.3)'; event.stopPropagation();"
        >
          Get Directions
        </button>
      </div>
    </div>
  `;
};
