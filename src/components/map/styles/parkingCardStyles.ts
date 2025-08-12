// src/components/map/styles/parkingCardStyles.ts
import type { SxProps, Theme } from "@mui/material";

export const sharedCardStyles = {
  // Base card styling
  baseCard: {
    borderRadius: 3,
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
      transform: "translateY(-1px)",
    },
  } as SxProps<Theme>,

  // Selected card state
  selectedCard: {
    border: "2px solid #1976d2",
    background:
      "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)",
    boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
  } as SxProps<Theme>,

  // Unselected card state
  unselectedCard: {
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  } as SxProps<Theme>,

  // Available spot styling
  availableSpot: {
    background: "white",
    opacity: 1,
  } as SxProps<Theme>,

  // Occupied spot styling
  occupiedSpot: {
    background: "#f8f8f8",
    opacity: 0.75,
  } as SxProps<Theme>,

  // Availability indicator dot
  availabilityDot: {
    position: "absolute",
    borderRadius: "50%",
    border: "3px solid white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 10,
  } as SxProps<Theme>,

  // Parking sign base styling
  parkingSign: {
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  } as SxProps<Theme>,

  // Parking sign with restrictions
  parkingSignWithRestrictions: {
    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
  } as SxProps<Theme>,

  // Parking sign without restrictions
  parkingSignNoRestrictions: {
    background: "linear-gradient(135deg, #666 0%, #555 100%)",
  } as SxProps<Theme>,

  // Directions button base
  directionsButton: {
    color: "#1976d2",
    "&:hover": {
      bgcolor: "#1976d2",
      color: "white",
      transform: "scale(1.05)",
    },
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  } as SxProps<Theme>,

  // Distance display
  distanceDisplay: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  } as SxProps<Theme>,

  // Walking time display
  walkingTimeDisplay: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  } as SxProps<Theme>,

  // Expandable details section
  expandableDetails: {
    borderTop: "1px solid #e0e0e0",
    bgcolor: "#f8f9fa",
  } as SxProps<Theme>,

  // Restriction item
  restrictionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    bgcolor: "white",
    borderRadius: 2,
    border: "1px solid #e0e0e0",
  } as SxProps<Theme>,

  // Expand button
  expandButton: {
    position: "absolute",
    color: "white",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.1)",
    },
  } as SxProps<Theme>,
};

// Color constants
export const colors = {
  available: "#22c55e",
  occupied: "#ef4444",
  primary: "#1976d2",
  primaryLight: "#f0f7ff",
  border: "#e3f2fd",
  textSecondary: "#666",
  backgroundSecondary: "#f8f9fa",
};

// Responsive breakpoints helper
export const responsive = {
  mobile: { xs: true, sm: false },
  tablet: { xs: false, sm: true, md: false },
  desktop: { md: true },
};
