// src/components/map/styles/parkingResultsListStyles.ts
import type { SxProps, Theme } from "@mui/material";

export const parkingResultsListStyles = {
  // Main container
  container: {
    overflowY: "auto",
    height: "100%",
    px: 1,
  } as SxProps<Theme>,

  // Empty state
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 8,
    textAlign: "center",
  } as SxProps<Theme>,

  emptyStateIcon: {
    fontSize: 48,
    color: "text.secondary",
    mb: 3,
  } as SxProps<Theme>,

  // Filter section
  filterSection: {
    mb: 3,
  } as SxProps<Theme>,

  filterLabel: {
    mb: 2,
    fontWeight: 600,
    color: "#666",
  } as SxProps<Theme>,

  filterChipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1.2,
    alignItems: "center",
  } as SxProps<Theme>,

  // Available count section
  availableCountSection: {
    mb: 3,
  } as SxProps<Theme>,

  availableCountText: {
    color: "#2e7d2e",
    fontWeight: 600,
    fontSize: "1rem",
  } as SxProps<Theme>,

  availableCountFiltered: {
    color: "#666",
    fontWeight: 400,
    ml: 1,
  } as SxProps<Theme>,

  // No filtered results
  noFilteredResults: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 6,
    textAlign: "center",
  } as SxProps<Theme>,

  // Grid layout for compact view
  gridContainer: {
    width: "100%",
  } as SxProps<Theme>,

  // List layout for detailed view
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
  } as SxProps<Theme>,
};

// Filter chip styles - separate function since it needs dynamic values
export const getFilterChipStyles = (
  isActive: boolean,
  color: string
): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.8,
  px: 1.8,
  py: 1,
  borderRadius: 20, // Smaller pill shape
  border: `1.5px solid ${color}`,
  bgcolor: isActive ? color : "transparent",
  color: isActive ? "white" : color,
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: 600,
  minHeight: 32, // Smaller height
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    bgcolor: isActive ? color : `${color}06`,
    transform: "translateY(-1px) scale(1.02)",
    // Elegant glow effect that spills outside
    boxShadow: `
      0 0 0 1px ${color}10,
      0 2px 8px ${color}15,
      0 4px 16px ${color}10,
      0 8px 32px ${color}08
    `,
  },
  "&:active": {
    transform: "translateY(0px) scale(0.98)",
  },
  // Active state with beautiful glow
  ...(isActive && {
    boxShadow: `
      0 0 0 1px ${color}20,
      0 2px 12px ${color}25,
      0 4px 20px ${color}15,
      0 8px 40px ${color}10
    `,
    "&:hover": {
      boxShadow: `
        0 0 0 1px ${color}30,
        0 3px 15px ${color}35,
        0 6px 25px ${color}20,
        0 12px 50px ${color}15
      `,
    },
  }),
});

// Filter chip label styles
export const filterChipLabelStyles: SxProps<Theme> = {
  fontWeight: "inherit",
  fontSize: "inherit",
  color: "inherit",
  lineHeight: 1.2,
};

// Filter chip count badge styles
export const getFilterChipCountStyles = (
  isActive: boolean,
  color: string
): SxProps<Theme> => ({
  bgcolor: isActive ? "rgba(255,255,255,0.25)" : `${color}12`,
  color: isActive ? "white" : color,
  borderRadius: "50%",
  minWidth: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.7rem",
  fontWeight: 700,
  lineHeight: 1,
});

// Special styling for "No Limits" filter
export const getNoLimitsFilterChipStyles = (
  isActive: boolean,
  color: string
): SxProps<Theme> => ({
  ...getFilterChipStyles(isActive, color),
  fontWeight: 700, // Make "No Limits" bolder
});

// Filter chip types and their configurations
export interface FilterChipConfig {
  key: string;
  label: string;
  color: string;
}

export const filterChipConfigs: FilterChipConfig[] = [
  { key: "all", label: "All", color: "#666" },
  { key: "no-restrictions", label: "Economical", color: "#22c55e" }, // Changed from "No Limits"
  { key: "1p", label: "1P", color: "#1976d2" },
  { key: "2p", label: "2P", color: "#1976d2" },
  { key: "3p", label: "3P", color: "#1976d2" },
];
