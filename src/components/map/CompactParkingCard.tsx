// src/components/map/CompactParkingCard.tsx
import { useCallback } from "react";
import { Box, Typography, Card, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigationIcon from "@mui/icons-material/Navigation";
import type { ParkingSpot } from "../../types/parking";
import { formatDays } from "../../types/parking";
import StatusChip from "./StatusChip";
import { sharedCardStyles, colors } from "./styles/parkingCardStyles";
import { compactCardStyles } from "./styles/compactCardStyles";
import type { SxProps, Theme } from "@mui/material/styles";

interface CompactParkingCardProps {
  spot: ParkingSpot & {
    distance: number;
    formattedDistance: string;
    originalIndex: number;
  };
  isEconomicalSpot: boolean;
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
  isEconomicalSpot,
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

  const cardStyles = {
    ...sharedCardStyles.baseCard,
    ...compactCardStyles.card,
    ...(isSelected
      ? sharedCardStyles.selectedCard
      : sharedCardStyles.unselectedCard),
    ...(isAvailable
      ? sharedCardStyles.availableSpot
      : sharedCardStyles.occupiedSpot),
  } as SxProps<Theme>;

  const parkingSignStyles = {
    ...sharedCardStyles.parkingSign,
    ...compactCardStyles.parkingSign,
    ...(primaryRestriction
      ? sharedCardStyles.parkingSignWithRestrictions
      : sharedCardStyles.parkingSignNoRestrictions),
  } as SxProps<Theme>;

  const availabilityDotStyles = {
    ...sharedCardStyles.availabilityDot,
    ...compactCardStyles.availabilityDot,
    bgcolor: isAvailable ? colors.available : colors.occupied,
  } as SxProps<Theme>;

  const directionsButtonStyles = {
    ...sharedCardStyles.directionsButton,
    ...compactCardStyles.directionsButton,
  } as SxProps<Theme>;

  return (
    <Card onClick={handleCardClick} sx={cardStyles}>
      {/* Closest Badge */}
      {isClosestSpot && (
        <StatusChip variant="closest" sx={compactCardStyles.closestChip} />
      )}

      {isEconomicalSpot && (
        <StatusChip
          variant="economical"
          size="small"
          sx={{
            position: "absolute",
            top: isClosestSpot ? 45 : 12,
            right: 12,
            bgcolor: "#22c55e",
            color: "white",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 22,
            px: 1,
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
          }}
        />
      )}

      {/* Economical Badge - show when no restrictions */}
      {!hasRestrictions && (
        <StatusChip
          variant="economical"
          sx={{
            ...compactCardStyles.closestChip,
            top: isClosestSpot ? 40 : 8,
          }}
        />
      )}

      {/* Availability indicator */}
      <Box sx={availabilityDotStyles} />

      <Box sx={compactCardStyles.container}>
        {/* Parking Sign */}
        <Box sx={parkingSignStyles}>
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
                  : primaryRestriction.Rule?.slice(0, 4) || "No Limits"}
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
            sx={directionsButtonStyles}
          >
            <NavigationIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
