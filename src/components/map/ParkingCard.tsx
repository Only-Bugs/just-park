import { useState, useCallback, memo } from "react";
import { Box, Typography, Card, Chip, IconButton, Fab } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import NavigationIcon from "@mui/icons-material/Navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ParkingSpot } from "../../types/parking";
import { getWalkingTime } from "../../utils/distanceUtils";
import {
  interpretParkingRule,
  formatDays,
  formatTime,
  getRestrictionsForCurrentTime,
} from "../../types/parking";

type SpotWithDistance = ParkingSpot & {
  distance: number;
  formattedDistance: string;
  originalIndex: number;
};

interface ParkingCardProps {
  spot: SpotWithDistance;
  isSelected: boolean;
  isClosestSpot: boolean;
  onCardClick: (spotId: string) => void;
  onDirections: (spot: ParkingSpot) => void;
  showDistance: boolean;
}

const ParkingCard = memo(function ParkingCard({
  spot,
  isSelected,
  isClosestSpot,
  onCardClick,
  onDirections,
  showDistance,
}: ParkingCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const isAvailable = spot.status === "Unoccupied";
  const currentRestrictions = getRestrictionsForCurrentTime(
    spot.restrictions || []
  );
  const primaryRestriction = spot.currentRestriction || currentRestrictions[0];

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

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        border: isSelected ? "2px solid #1976d2" : "1px solid #e0e0e0",
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          transform: "translateY(-1px)",
        },
        background: isSelected
          ? "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)"
          : "white",
        boxShadow: isSelected
          ? "0 4px 20px rgba(25, 118, 210, 0.3)"
          : "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Closest Badge - Top Right Corner */}
      {isClosestSpot && (
        <Chip
          label="Closest"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "#1976d2",
            color: "white",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 22,
            px: 1,
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
          }}
        />
      )}

      <Box sx={{ display: "flex", minHeight: 100 }}>
        {/* Left: Parking Sign */}
        <Box
          sx={{
            width: 140,
            background: primaryRestriction
              ? "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
              : "linear-gradient(135deg, #666 0%, #555 100%)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            position: "relative",
          }}
        >
          {primaryRestriction ? (
            <>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  lineHeight: 0.8,
                  fontSize: "2.5rem",
                  mb: 0.5,
                }}
              >
                {primaryRestriction.Rule.includes("2P")
                  ? "2P"
                  : primaryRestriction.Rule.includes("1P")
                  ? "1P"
                  : primaryRestriction.Rule.includes("30")
                  ? "30M"
                  : primaryRestriction.Rule.includes("4P")
                  ? "4P"
                  : primaryRestriction.Rule}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {formatTime(primaryRestriction.Start_Time).replace(" ", "")} -{" "}
                {formatTime(primaryRestriction.End_Time).replace(" ", "")}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  textAlign: "center",
                  opacity: 0.9,
                  letterSpacing: "0.5px",
                }}
              >
                {formatDays(primaryRestriction.Days).toUpperCase()}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontSize: "0.9rem", fontWeight: 600 }}
            >
              NO RESTRICTIONS
            </Typography>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid white",
            }}
          />
        </Box>

        {/* Center: Spot Info */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 0.5 }}
              >
                Spot {spot.id}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Zone: {spot.zone || "N/A"}
              </Typography>
            </Box>
          </Box>

          {showDistance && spot.distance > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#1976d2" }} />
                <Typography variant="body2" fontWeight="600" color="primary">
                  {spot.formattedDistance}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <DirectionsWalkIcon sx={{ fontSize: 16, color: "#666" }} />
                <Typography variant="body2" color="text.secondary">
                  {getWalkingTime(spot.distance)} walk
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Right: Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2.5,
            gap: 1.5,
            justifyContent: "space-between", // Changed to space-between for even spacing
            alignItems: "center",
            minWidth: 80,
          }}
        >
          {/* Details Toggle - Top */}
          {spot.restrictions && spot.restrictions.length > 1 && (
            <IconButton
              size="small"
              onClick={handleDetailsToggle}
              sx={{
                bgcolor: "rgba(0,0,0,0.04)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                width: 32,
                height: 32,
              }}
            >
              <ExpandMoreIcon
                sx={{
                  fontSize: 18,
                  transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </IconButton>
          )}

          {/* Round Directions Button - Center */}
          <Fab
            size="medium"
            color="primary"
            variant="extended"
            onClick={handleDirectionsClick}
            sx={{
              bgcolor: "#f5f5f5",
              color: "#1976d2",
              width: 56,
              height: 56,
              "&:hover": {
                bgcolor: "#1976d2",
                color: "white",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <NavigationIcon sx={{ fontSize: 24 }} />
          </Fab>

          {/* Available/Occupied Chip - Bottom */}
          <Chip
            label={isAvailable ? "Available" : "Occupied"}
            size="small"
            sx={{
              bgcolor: isAvailable ? "#22c55e" : "#ef4444",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              px: 1,
              py: 0.5,
            }}
          />
        </Box>
      </Box>

      {/* Expandable Details */}
      {showDetails && spot.restrictions && spot.restrictions.length > 1 && (
        <Box sx={{ borderTop: "1px solid #e0e0e0", p: 3, bgcolor: "#f8f9fa" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            All Restrictions:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {spot.restrictions.map((restriction, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {interpretParkingRule(restriction.Rule)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
});

export default ParkingCard;
