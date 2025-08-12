import { useState, useCallback, useMemo, useRef, useEffect, memo } from "react";
import { Box, Typography, Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { ParkingSpot } from "../../types/parking";
import { sortSpotsByDistance } from "../../utils/distanceUtils";
import CompactParkingCard from "./CompactParkingCard";
import DetailedParkingCard from "./DetailedParkingCard";
// Temporarily comment out the ParkingFilter import to fix the error
// import ParkingFilter, { filterSpotsByType, type FilterType } from "./ParkingFilter";

// Temporary inline filter types and functions until we fix the import
export type FilterType = "all" | "no-restrictions" | "1p" | "2p" | "3p";

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

const filterSpotsByType = (
  spots: ParkingSpot[],
  filterType: FilterType
): ParkingSpot[] => {
  if (filterType === "all") return spots;
  return spots.filter((spot) => getParkingType(spot) === filterType);
};

interface ParkingResultsListProps {
  spots: ParkingSpot[];
  selectedSpotId: string | null;
  onSelectSpot: (spotId: string) => void;
  onViewOnMap?: (spotId: string) => void;
  searchLocation?: { lat: number; lng: number } | null;
  viewMode?: "detailed" | "compact";
}

type SpotWithDistance = ParkingSpot & {
  distance: number;
  formattedDistance: string;
  originalIndex: number;
};

function ParkingResultsList({
  spots,
  selectedSpotId,
  onSelectSpot,
  onViewOnMap,
  searchLocation,
  viewMode = "detailed",
}: ParkingResultsListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // LOCKED STABLE APPROACH - Once sorted, NEVER re-sort again
  const hasEverBeenSortedRef = useRef(false);
  const lockedSortedSpotsRef = useRef<SpotWithDistance[]>([]);
  const lockedClosestSpotIdRef = useRef<string | null>(null);
  const initialSpotsCountRef = useRef(0);

  // Create stable sorted list that gets LOCKED on first calculation
  const stableSortedSpots = useMemo(() => {
    if (
      hasEverBeenSortedRef.current &&
      lockedSortedSpotsRef.current.length > 0 &&
      spots.length === initialSpotsCountRef.current
    ) {
      return lockedSortedSpotsRef.current;
    }

    initialSpotsCountRef.current = spots.length;

    if (!searchLocation) {
      const spotsWithoutDistance = spots.map((spot, index) => ({
        ...spot,
        distance: 0,
        formattedDistance: "",
        originalIndex: index,
      }));

      lockedSortedSpotsRef.current = spotsWithoutDistance;
      lockedClosestSpotIdRef.current = null;
      hasEverBeenSortedRef.current = true;

      return spotsWithoutDistance;
    }

    const sortedWithDistance = sortSpotsByDistance(spots, searchLocation).map(
      (spot, index) => ({
        ...spot,
        originalIndex: index,
      })
    );

    lockedSortedSpotsRef.current = sortedWithDistance;
    lockedClosestSpotIdRef.current =
      sortedWithDistance.length > 0 ? sortedWithDistance[0].id : null;
    hasEverBeenSortedRef.current = true;

    return sortedWithDistance;
  }, [spots, searchLocation]);

  // Apply filtering to the stable sorted spots
  const filteredSpots = useMemo(() => {
    return filterSpotsByType(stableSortedSpots, activeFilter);
  }, [stableSortedSpots, activeFilter]);

  useEffect(() => {
    if (spots.length === 0) {
      hasEverBeenSortedRef.current = false;
      lockedSortedSpotsRef.current = [];
      lockedClosestSpotIdRef.current = null;
      initialSpotsCountRef.current = 0;
      setActiveFilter("all");
    }
  }, [spots.length]);

  const handleCardClick = useCallback(
    (spotId: string) => {
      onSelectSpot(spotId);
    },
    [onSelectSpot]
  );

  const handleDirections = useCallback((spot: ParkingSpot) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`,
      "_blank"
    );
  }, []);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  const availableCount = filteredSpots.filter(
    (spot) => spot.status === "Unoccupied"
  ).length;

  if (spots.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          textAlign: "center",
        }}
      >
        <LocationOnIcon sx={{ fontSize: 48, color: "text.secondary", mb: 3 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No parking spots found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search location or filters
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowY: "auto", height: "100%", px: 1 }}>
      {/* Modern chip-based filter */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{ mb: 2, fontWeight: 600, color: "#666" }}
        >
          Filter by parking type:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.2,
            alignItems: "center",
          }}
        >
          {[
            { key: "all", label: "All", color: "#666" },
            { key: "no-restrictions", label: "No Limits", color: "#22c55e" },
            { key: "1p", label: "1P", color: "#1976d2" },
            { key: "2p", label: "2P", color: "#1976d2" },
            { key: "3p", label: "3P", color: "#1976d2" },
          ].map(({ key, label, color }) => {
            const isActive = activeFilter === key;
            const count =
              key === "all"
                ? stableSortedSpots.length
                : filterSpotsByType(stableSortedSpots, key as FilterType)
                    .length;

            return (
              <Box
                key={key}
                onClick={() => handleFilterChange(key as FilterType)}
                sx={{
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
                  // Special styling for "No Limits"
                  ...(key === "no-restrictions" && {
                    fontWeight: 700,
                  }),
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
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "inherit",
                    fontSize: "inherit",
                    color: "inherit",
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </Typography>
                <Box
                  sx={{
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
                  }}
                >
                  {count}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Available count for filtered results */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          sx={{
            color: "#2e7d2e",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          {availableCount} parking spots available
          {activeFilter !== "all" && (
            <Typography
              component="span"
              sx={{ color: "#666", fontWeight: 400, ml: 1 }}
            >
              (filtered)
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Show message if no spots match filter */}
      {filteredSpots.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No spots match the selected filter
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try selecting a different parking type filter
          </Typography>
        </Box>
      ) : (
        <>
          {/* Render based on view mode */}
          {viewMode === "compact" ? (
            // Grid layout for compact view
            <Grid container spacing={3} sx={{ width: "100%" }}>
              {filteredSpots.map((spot) => (
                <Grid item xs={12} sm={6} key={spot.id}>
                  <CompactParkingCard
                    spot={spot}
                    isSelected={selectedSpotId === spot.id}
                    isClosestSpot={
                      searchLocation
                        ? spot.id === lockedClosestSpotIdRef.current
                        : false
                    }
                    showDistance={!!searchLocation}
                    onCardClick={handleCardClick}
                    onDirections={handleDirections}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            // List layout for detailed view
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {filteredSpots.map((spot) => (
                <DetailedParkingCard
                  key={spot.id}
                  spot={spot}
                  isSelected={selectedSpotId === spot.id}
                  isClosestSpot={
                    searchLocation
                      ? spot.id === lockedClosestSpotIdRef.current
                      : false
                  }
                  showDistance={!!searchLocation}
                  onCardClick={handleCardClick}
                  onDirections={handleDirections}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default memo(ParkingResultsList);
