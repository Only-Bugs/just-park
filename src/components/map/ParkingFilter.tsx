// src/components/map/ParkingFilter.tsx
import { useState, useRef } from "react";
import { Box, Chip, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { ParkingSpot } from "../../types/parking";

export type FilterType = "all" | "no-restrictions" | "1p" | "2p" | "3p";

interface ParkingFilterProps {
  spots: ParkingSpot[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

// Helper function to get parking type from spot
const getParkingType = (spot: ParkingSpot): FilterType => {
  if (!spot.restrictions || spot.restrictions.length === 0) {
    return "no-restrictions";
  }

  const primaryRestriction = spot.currentRestriction || spot.restrictions[0];
  if (!primaryRestriction?.Rule) {
    return "no-restrictions";
  }

  const rule = primaryRestriction.Rule.toLowerCase();
  if (rule.includes("1p")) return "1p";
  if (rule.includes("2p")) return "2p";
  if (rule.includes("3p")) return "3p";

  return "all";
};

// Get counts for each filter type
const getFilterCounts = (spots: ParkingSpot[]) => {
  const counts = {
    all: spots.length,
    "no-restrictions": 0,
    "1p": 0,
    "2p": 0,
    "3p": 0,
  };

  spots.forEach((spot) => {
    const type = getParkingType(spot);
    if (type !== "all") {
      counts[type]++;
    }
  });

  return counts;
};

// Reordered filter configs with "No Limits" after "All"
const filterConfigs = [
  { key: "all" as FilterType, label: "All", color: "#666" },
  {
    key: "no-restrictions" as FilterType,
    label: "No Limits",
    color: "#22c55e",
  },
  { key: "1p" as FilterType, label: "1P", color: "#1976d2" },
  { key: "2p" as FilterType, label: "2P", color: "#1976d2" },
  { key: "3p" as FilterType, label: "3P", color: "#1976d2" },
];

export default function ParkingFilter({
  spots,
  activeFilter,
  onFilterChange,
}: ParkingFilterProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const counts = getFilterCounts(spots);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 120; // Adjust based on chip width
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    setScrollPosition(newPosition);
    container.scrollTo({ left: newPosition, behavior: "smooth" });
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current
    ? scrollPosition <
      scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth
    : false;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="body2"
        sx={{ mb: 1.5, fontWeight: 600, color: "#666" }}
      >
        Filter by parking type:
      </Typography>

      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Left scroll button */}
        {canScrollLeft && (
          <IconButton
            onClick={() => handleScroll("left")}
            sx={{
              position: "absolute",
              left: -8,
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              width: 32,
              height: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.95)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}

        {/* Scrollable filter container */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Chrome/Safari
            },
            py: 1,
            px: canScrollLeft ? 5 : 0,
            pr: canScrollRight ? 5 : 0,
            // Add fade effect on edges
            maskImage:
              canScrollLeft || canScrollRight
                ? "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)"
                : "none",
          }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            setScrollPosition(target.scrollLeft);
          }}
        >
          {filterConfigs.map(({ key, label, color }) => {
            const count = counts[key];
            const isActive = activeFilter === key;

            return (
              <Chip
                key={key}
                label={`${label} (${count})`}
                onClick={() => onFilterChange(key)}
                variant={isActive ? "filled" : "outlined"}
                sx={{
                  bgcolor: isActive ? color : "transparent",
                  color: isActive ? "white" : color,
                  borderColor: color,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  minWidth: "fit-content",
                  whiteSpace: "nowrap",
                  height: 36,
                  px: 2,
                  "&:hover": {
                    bgcolor: isActive ? color : `${color}15`,
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px ${color}30`,
                  },
                  transition: "all 0.2s ease",
                  // Add special styling for "No Limits"
                  ...(key === "no-restrictions" && {
                    borderWidth: "2px",
                    fontWeight: 700,
                  }),
                  // Add special styling for active state
                  ...(isActive && {
                    boxShadow: `0 4px 16px ${color}40`,
                    transform: "translateY(-1px)",
                  }),
                }}
              />
            );
          })}
        </Box>

        {/* Right scroll button */}
        {canScrollRight && (
          <IconButton
            onClick={() => handleScroll("right")}
            sx={{
              position: "absolute",
              right: -8,
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              width: 32,
              height: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.95)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

// Export the filter function for use in other components
export const filterSpotsByType = (
  spots: ParkingSpot[],
  filterType: FilterType
): ParkingSpot[] => {
  if (filterType === "all") return spots;

  return spots.filter((spot) => getParkingType(spot) === filterType);
};
