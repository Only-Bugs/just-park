// src/components/map/DetailedParkingCard.tsx
import { useState, useCallback } from "react";
import { Box, Typography, Card, IconButton, Fab, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import NavigationIcon from "@mui/icons-material/Navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ParkingSpot } from "../../types/parking";
import {
  interpretParkingRule,
  formatDays,
  formatTime,
  getRestrictionsForCurrentTime,
} from "../../types/parking";
import { getWalkingTime } from "../../utils/distanceUtils";
import StatusChip from "./StatusChip";
import { sharedCardStyles, colors } from "./styles/parkingCardStyles";
import { detailedCardStyles } from "./styles/detailedCardStyles";
import type { SxProps, Theme } from "@mui/material/styles";

interface DetailedParkingCardProps {
  spot: ParkingSpot & {
    distance: number;
    formattedDistance: string;
    originalIndex: number;
  };
  isSelected: boolean;
  isClosestSpot: boolean;
  showDistance: boolean;
  isEconomicalSpot: boolean;
  onCardClick: (spotId: string) => void;
  onDirections: (spot: ParkingSpot) => void;
}

export default function DetailedParkingCard({
  spot,
  isSelected,
  isClosestSpot,
  showDistance,
  onCardClick,
  onDirections,
  isEconomicalSpot,
}: DetailedParkingCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const isAvailable = spot.status === "Unoccupied";
  const currentRestrictions = getRestrictionsForCurrentTime(
    spot.restrictions || []
  );
  const primaryRestriction = spot.currentRestriction || currentRestrictions[0];
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

  const handleDetailsToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails((prev) => !prev);
  }, []);

  const cardStyles = {
    ...sharedCardStyles.baseCard,
    ...detailedCardStyles.card,
    ...(isSelected
      ? sharedCardStyles.selectedCard
      : sharedCardStyles.unselectedCard),
    ...(isAvailable
      ? sharedCardStyles.availableSpot
      : sharedCardStyles.occupiedSpot),
  } as SxProps<Theme>;

  const parkingSignStyles = {
    ...sharedCardStyles.parkingSign,
    ...detailedCardStyles.parkingSign,
    ...(primaryRestriction
      ? sharedCardStyles.parkingSignWithRestrictions
      : sharedCardStyles.parkingSignNoRestrictions),
  } as SxProps<Theme>;

  const availabilityDotStyles = {
    ...sharedCardStyles.availabilityDot,
    ...detailedCardStyles.availabilityDot,
    bgcolor: isAvailable ? colors.available : colors.occupied,
  } as SxProps<Theme>;

  const expandButtonStyles = {
    ...sharedCardStyles.expandButton,
    ...detailedCardStyles.expandButton,
  } as SxProps<Theme>;

  const directionsButtonStyles = {
    ...sharedCardStyles.directionsButton,
    ...detailedCardStyles.directionsButton,
  } as SxProps<Theme>;

  const expandableDetailsStyles = {
    ...sharedCardStyles.expandableDetails,
    ...detailedCardStyles.expandableDetails,
  } as SxProps<Theme>;

  const restrictionItemStyles = {
    ...sharedCardStyles.restrictionItem,
    ...detailedCardStyles.restrictionItem,
  } as SxProps<Theme>;

  return (
    <Card onClick={handleCardClick} sx={cardStyles}>
      {/* Availability indicator */}
      <Box sx={availabilityDotStyles} />

      <Box sx={detailedCardStyles.container}>
        {/* Left: Parking Sign */}
        <Box sx={parkingSignStyles}>
          {primaryRestriction ? (
            <>
              <Typography variant="h3" sx={detailedCardStyles.parkingSignText}>
                {primaryRestriction.Rule?.includes("2P")
                  ? "2P"
                  : primaryRestriction.Rule?.includes("1P")
                  ? "1P"
                  : primaryRestriction.Rule?.includes("30")
                  ? "30M"
                  : primaryRestriction.Rule?.includes("4P")
                  ? "4P"
                  : primaryRestriction.Rule || "N/A"}
              </Typography>

              <Typography
                variant="body2"
                sx={detailedCardStyles.parkingSignTime}
              >
                {formatTime(primaryRestriction.Start_Time || "").replace(
                  " ",
                  ""
                )}{" "}
                -{" "}
                {formatTime(primaryRestriction.End_Time || "").replace(" ", "")}
              </Typography>

              <Typography
                variant="caption"
                sx={detailedCardStyles.parkingSignDays}
              >
                {formatDays(primaryRestriction.Days || "").toUpperCase()}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={detailedCardStyles.noRestrictionsText}
            >
              NO RESTRICTIONS
            </Typography>
          )}

          {/* Expandable arrow - only show if multiple restrictions */}
          {spot.restrictions && spot.restrictions.length > 1 && (
            <IconButton onClick={handleDetailsToggle} sx={expandButtonStyles}>
              <ExpandMoreIcon
                sx={{
                  fontSize: 18,
                  transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </IconButton>
          )}
        </Box>

        {/* Center: Distance and Closest Info */}
        <Box sx={detailedCardStyles.contentContainer}>
          {showDistance && spot.distance > 0 && (
            <Box sx={detailedCardStyles.distanceContainer}>
              {/* Distance - larger and more prominent */}
              <Box sx={detailedCardStyles.distanceDisplay}>
                <LocationOnIcon
                  sx={{ fontSize: { xs: 20, sm: 24 }, color: colors.primary }}
                />
                <Typography
                  variant="h5"
                  color="primary"
                  sx={detailedCardStyles.distanceText}
                >
                  {spot.formattedDistance}
                </Typography>
              </Box>

              {/* Walking time */}
              <Box sx={detailedCardStyles.walkingTimeDisplay}>
                <DirectionsWalkIcon
                  sx={{
                    fontSize: { xs: 16, sm: 18 },
                    color: colors.textSecondary,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={detailedCardStyles.walkingTimeText}
                >
                  {getWalkingTime(spot.distance)}
                </Typography>
              </Box>

              {/* Chip section - stacked vertically */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}
              >
                {/* Closest chip */}
                {isClosestSpot && (
                  <StatusChip
                    variant="closest"
                    sx={detailedCardStyles.closestChip}
                  />
                )}
                {isEconomicalSpot && (
                  <Chip
                    label="Economical"
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

                {/* Economical chip - show when no restrictions */}
                {!hasRestrictions && (
                  <StatusChip
                    variant="economical"
                    sx={detailedCardStyles.closestChip}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Right: Actions */}
        <Box sx={detailedCardStyles.actionsContainer}>
          <Fab
            size="medium"
            color="primary"
            variant="extended"
            onClick={handleDirectionsClick}
            sx={directionsButtonStyles}
          >
            <NavigationIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Fab>
        </Box>
      </Box>

      {/* Expandable Details */}
      {showDetails && spot.restrictions && spot.restrictions.length > 1 && (
        <Box sx={expandableDetailsStyles}>
          <Typography
            variant="subtitle2"
            sx={detailedCardStyles.expandableTitle}
          >
            All Restrictions:
          </Typography>
          <Box sx={detailedCardStyles.restrictionsList}>
            {spot.restrictions.map((restriction, idx) => (
              <Box key={idx} sx={restrictionItemStyles}>
                <Typography
                  variant="body2"
                  sx={detailedCardStyles.restrictionTitle}
                >
                  {interpretParkingRule(restriction.Rule)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={detailedCardStyles.restrictionDetails}
                >
                  {formatDays(restriction.Days)} •{" "}
                  {formatTime(restriction.Start_Time)} -{" "}
                  {formatTime(restriction.End_Time)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Card>
  );
}
