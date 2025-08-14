// src/components/map/styles/compactCardStyles.ts
import type { SxProps, Theme } from "@mui/material";

export const compactCardStyles = {
  card: {
    height: "100%",
    minHeight: 200,
  } as SxProps<Theme>,

  availabilityDot: {
    top: 12,
    left: 12,
    width: 14,
    height: 14,
  } as SxProps<Theme>,

  closestChip: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    fontSize: "0.65rem",
    height: 20,
    px: 0.5,
  } as SxProps<Theme>,

  container: {
    p: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  } as SxProps<Theme>,

  parkingSign: {
    width: "100%",
    height: 70,
    borderRadius: 2,
    mb: 2,
    boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
  } as SxProps<Theme>,

  parkingSignText: {
    fontWeight: 900,
    fontSize: "1.5rem",
    lineHeight: 1,
    mb: 0.5,
  } as SxProps<Theme>,

  parkingSignSubtext: {
    fontSize: "0.7rem",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 1,
    fontWeight: 500,
  } as SxProps<Theme>,

  noRestrictionsText: {
    textAlign: "center",
    fontSize: "0.8rem",
    fontWeight: 700,
  } as SxProps<Theme>,

  spotInfo: {
    flex: 1,
    mb: 2,
  } as SxProps<Theme>,

  spotTitle: {
    fontWeight: 700,
    fontSize: "1.1rem",
    mb: 1,
    color: "#1a1a1a",
  } as SxProps<Theme>,

  spotZone: {
    display: "block",
    mb: 1.5,
    fontSize: "0.85rem",
  } as SxProps<Theme>,

  distanceContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
  } as SxProps<Theme>,

  distanceText: {
    fontWeight: 600,
    fontSize: "0.85rem",
  } as SxProps<Theme>,

  actionsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mt: "auto",
  } as SxProps<Theme>,

  directionsButton: {
    bgcolor: "#f0f7ff",
    width: 48,
    height: 48,
    border: "2px solid #e3f2fd",
  } as SxProps<Theme>,
};
