import { useState, useCallback, useMemo, useRef, useEffect, memo } from "react";
import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { ParkingSpot } from "../../types/parking";
import { sortSpotsByDistance } from "../../utils/distanceUtils";
import CompactParkingCard from "./CompactParkingCard";
import DetailedParkingCard from "./DetailedParkingCard";
import {
  parkingResultsListStyles,
  getFilterChipStyles,
  getNoLimitsFilterChipStyles,
  getFilterChipCountStyles,
  filterChipLabelStyles,
  filterChipConfigs,
  type FilterChipConfig,
} from "./styles/parkingResultsListStyles";

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
  spots: SpotWithDistance[],
  filterType: FilterType
): SpotWithDistance[] => {
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
  const filteredSpots: SpotWithDistance[] = useMemo(() => {
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

  const handleFilterChange = useCallback(
    (filter: FilterType) => {
      // Toggle behavior: if clicking the same filter, go back to "all"
      setActiveFilter(activeFilter === filter ? "all" : filter);
    },
    [activeFilter]
  );

  const availableCount = filteredSpots.filter(
    (spot) => spot.status === "Unoccupied"
  ).length;

  const isEconomicalSpot = (spot: ParkingSpot): boolean => {
    return !spot.restrictions || spot.restrictions.length === 0;
  };

  if (spots.length === 0) {
    return (
      <Box sx={parkingResultsListStyles.emptyState}>
        <LocationOnIcon sx={parkingResultsListStyles.emptyStateIcon} />
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
    <Box sx={parkingResultsListStyles.container}>
      {/* Modern chip-based filter */}
      <Box sx={parkingResultsListStyles.filterSection}>
        <Typography variant="body2" sx={parkingResultsListStyles.filterLabel}>
          Filter by parking type:
        </Typography>
        <Box sx={parkingResultsListStyles.filterChipsContainer}>
          {filterChipConfigs.map(({ key, label, color }: FilterChipConfig) => {
            const isActive = activeFilter === key;
            const count =
              key === "all"
                ? stableSortedSpots.length
                : filterSpotsByType(stableSortedSpots, key as FilterType)
                    .length;

            const chipStyles =
              key === "no-restrictions"
                ? getNoLimitsFilterChipStyles(isActive, color)
                : getFilterChipStyles(isActive, color);

            return (
              <Box
                key={key}
                onClick={() => handleFilterChange(key as FilterType)}
                sx={chipStyles}
              >
                <Typography variant="body2" sx={filterChipLabelStyles}>
                  {label}
                </Typography>
                <Box sx={getFilterChipCountStyles(isActive, color)}>
                  {count}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Available count for filtered results */}
      <Box sx={parkingResultsListStyles.availableCountSection}>
        <Typography
          variant="body1"
          sx={parkingResultsListStyles.availableCountText}
        >
          {availableCount} parking spots available
          {activeFilter !== "all" && (
            <Typography
              component="span"
              sx={parkingResultsListStyles.availableCountFiltered}
            >
              (filtered)
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Show message if no spots match filter */}
      {filteredSpots.length === 0 ? (
        <Box sx={parkingResultsListStyles.noFilteredResults}>
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
            // Grid layout for compact view - using simple container and flexbox for compatibility
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {filteredSpots.map((spot) => (
                <Box
                  key={spot.id}
                  sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)" } }}
                >
                  <CompactParkingCard
                    spot={spot}
                    isSelected={selectedSpotId === spot.id}
                    isClosestSpot={
                      searchLocation
                        ? spot.id === lockedClosestSpotIdRef.current
                        : false
                    }
                    isEconomicalSpot={isEconomicalSpot(spot)}
                    showDistance={!!searchLocation}
                    onCardClick={handleCardClick}
                    onDirections={handleDirections}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            // List layout for detailed view
            <Box sx={parkingResultsListStyles.listContainer}>
              {filteredSpots.map((spot) => (
                <DetailedParkingCard
                  key={spot.id}
                  spot={spot}
                  isSelected={selectedSpotId === spot.id}
                  isEconomicalSpot={isEconomicalSpot(spot)}
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
