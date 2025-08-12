// src/components/map/CompactParkingCard.tsx
import { useCallback } from "react";
import { Box, Typography, Card, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigationIcon from "@mui/icons-material/Navigation";
import type { ParkingSpot, ParkingRestriction } from "../../types/parking";
import { formatDays } from "../../types/parking";
import { getWalkingTime } from "../../utils/distanceUtils";
import StatusChip from "./StatusChip";
import { sharedCardStyles, colors } from "./styles/parkingCardStyles";
import { compactCardStyles } from "./styles/compactCardStyles";

interface CompactParkingCardProps {
  spot: ParkingSpot & {
    distance: number;
    formattedDistance: string;
    originalIndex: number;
  };
  isSelected: boolean;
  isClosestSpot: boolean;
  showDistance: boolean;
  onCardClick: (spotId: string) => void;
  onDirections: (spot: ParkingSpot) => void;
}

export default function CompactParkingCard({
  spot,
  isSelected,
  isClosestSpot,
  showDistance,
  onCardClick,
  onDirections,
}: CompactParkingCardProps) {
  const isAvailable = spot.status === "Unoccupied";
  const primaryRestriction = spot.currentRestriction || spot.restrictions?.[0];
  const hasRestrictions = spot.restrictions && spot.restrictions.length > 0;

  const handleCardClick = useCallback(() => {
    onCardClick(spot.id);
  }, [onCardClick, spot.id]);

  const handleDirectionsClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDirections(spot);
    },
    [onDirections, spot]
  );

  const getCardStyles = () => ({
    ...sharedCardStyles.baseCard,
    ...compactCardStyles.card,
    ...(isSelected
      ? sharedCardStyles.selectedCard
      : sharedCardStyles.unselectedCard),
    ...(isAvailable
      ? sharedCardStyles.availableSpot
      : sharedCardStyles.occupiedSpot),
  });

  const getParkingSignStyles = () => ({
    ...sharedCardStyles.parkingSign,
    ...compactCardStyles.parkingSign,
    ...(primaryRestriction
      ? sharedCardStyles.parkingSignWithRestrictions
      : sharedCardStyles.parkingSignNoRestrictions),
  });

  return (
    <Card onClick={handleCardClick} sx={getCardStyles()}>
      {/* Closest Badge */}
      {isClosestSpot && (
        <StatusChip variant="closest" sx={compactCardStyles.closestChip} />
      )}

      {/* Economical Badge - show when no restrictions */}
      {!hasRestrictions && (
        <StatusChip
          variant="economical"
          sx={{
            ...compactCardStyles.closestChip,
            top: isClosestSpot ? 40 : 8, // Position below closest chip if both exist
          }}
        />
      )}

      {/* Availability indicator */}
      <Box
        sx={{
          ...sharedCardStyles.availabilityDot,
          ...compactCardStyles.availabilityDot,
          bgcolor: isAvailable ? colors.available : colors.occupied,
        }}
      />

      <Box sx={compactCardStyles.container}>
        {/* Parking Sign */}
        <Box sx={getParkingSignStyles()}>
          {primaryRestriction ? (
            <>
              <Typography variant="h5" sx={compactCardStyles.parkingSignText}>
                {primaryRestriction.Rule?.includes("2P")
                  ? "2P"
                  : primaryRestriction.Rule?.includes("1P")
                  ? "1P"
                  : primaryRestriction.Rule?.includes("30")
                  ? "30M"
                  : primaryRestriction.Rule?.includes("4P")
                  ? "4P"
                  : primaryRestriction.Rule?.slice(0, 4) || "N/A"}
              </Typography>
              <Typography
                variant="caption"
                sx={compactCardStyles.parkingSignSubtext}
              >
                {formatDays(primaryRestriction.Days || "").slice(0, 10)}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={compactCardStyles.noRestrictionsText}
            >
              NO LIMITS
            </Typography>
          )}
        </Box>

        {/* Spot Info */}
        <Box sx={compactCardStyles.spotInfo}>
          <Typography variant="h6" sx={compactCardStyles.spotTitle}>
            Spot {spot.id}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={compactCardStyles.spotZone}
          >
            Zone: {spot.zone || "N/A"}
          </Typography>

          {showDistance && spot.distance > 0 && (
            <Box sx={compactCardStyles.distanceContainer}>
              <LocationOnIcon sx={{ fontSize: 16, color: colors.primary }} />
              <Typography
                variant="body2"
                color="primary"
                sx={compactCardStyles.distanceText}
              >
                {spot.formattedDistance}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box sx={compactCardStyles.actionsContainer}>
          <IconButton
            size="medium"
            onClick={handleDirectionsClick}
            sx={{
              ...sharedCardStyles.directionsButton,
              ...compactCardStyles.directionsButton,
            }}
          >
            <NavigationIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
