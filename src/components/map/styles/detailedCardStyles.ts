// src/components/map/styles/detailedCardStyles.ts
import type { SxProps, Theme } from "@mui/material";

export const detailedCardStyles = {
  card: {
    minHeight: { xs: 120, sm: 100 },
  } as SxProps<Theme>,

  availabilityDot: {
    top: 12,
    left: 12,
    width: 16,
    height: 16,
  } as SxProps<Theme>,

  container: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
  } as SxProps<Theme>,

  parkingSign: {
    width: { xs: "100%", sm: 140 },
    minHeight: { xs: 80, sm: "auto" },
    p: { xs: 2, sm: 2 },
  } as SxProps<Theme>,

  parkingSignText: {
    fontWeight: 900,
    lineHeight: 0.8,
    fontSize: { xs: "2rem", sm: "2.5rem" },
    mb: 0.5,
  } as SxProps<Theme>,

  parkingSignTime: {
    fontSize: { xs: "0.7rem", sm: "0.8rem" },
    fontWeight: 600,
    textAlign: "center",
    lineHeight: 1.2,
    mb: 0.5,
  } as SxProps<Theme>,

  parkingSignDays: {
    fontSize: { xs: "0.6rem", sm: "0.65rem" },
    fontWeight: 500,
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: "0.5px",
  } as SxProps<Theme>,

  noRestrictionsText: {
    textAlign: "center",
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
    fontWeight: 600,
  } as SxProps<Theme>,

  expandButton: {
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    width: 24,
    height: 24,
  } as SxProps<Theme>,

  contentContainer: {
    flex: 1,
    p: { xs: 2, sm: 3 },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 1,
  } as SxProps<Theme>,

  distanceContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: { xs: "center", sm: "flex-start" },
  } as SxProps<Theme>,

  distanceDisplay: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
  } as SxProps<Theme>,

  distanceText: {
    fontWeight: 700,
    fontSize: { xs: "1.3rem", sm: "1.5rem" },
  } as SxProps<Theme>,

  walkingTimeDisplay: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
  } as SxProps<Theme>,

  walkingTimeText: {
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
  } as SxProps<Theme>,

  closestChip: {
    fontSize: "0.7rem",
    height: 24,
    px: 1,
    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
  } as SxProps<Theme>,

  actionsContainer: {
    display: "flex",
    flexDirection: { xs: "row", sm: "column" },
    justifyContent: { xs: "center", sm: "center" },
    alignItems: "center",
    p: { xs: 2, sm: 2.5 },
    gap: 1.5,
    minWidth: { xs: "auto", sm: 80 },
  } as SxProps<Theme>,

  directionsButton: {
    bgcolor: "#f5f5f5",
    width: { xs: 48, sm: 56 },
    height: { xs: 48, sm: 56 },
  } as SxProps<Theme>,

  expandableDetails: {
    p: { xs: 2, sm: 3 },
  } as SxProps<Theme>,

  expandableTitle: {
    fontWeight: 600,
    mb: 2,
    fontSize: { xs: "0.9rem", sm: "1rem" },
  } as SxProps<Theme>,

  restrictionsList: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  } as SxProps<Theme>,

  restrictionItem: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    p: { xs: 1.5, sm: 2 },
    gap: { xs: 1, sm: 0 },
  } as SxProps<Theme>,

  restrictionTitle: {
    fontWeight: 600,
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
  } as SxProps<Theme>,

  restrictionDetails: {
    fontSize: { xs: "0.75rem", sm: "0.85rem" },
  } as SxProps<Theme>,
};
