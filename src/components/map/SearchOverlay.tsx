import { useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import LocationSearchBar from "../forms/search/LocationSearchBar";
import ParkingResultsList from "./ParkingResultsList";
import type { ParkingSpot } from "../../types/parking";

interface SearchOverlayProps {
  show: boolean;
  visibleSpots: ParkingSpot[];
  selectedSpotId: string | null;
  onClose: () => void;
  onSearch: (location: { lat: number; lng: number }) => void;
  onSelectSpot: (spotId: string) => void;
  onViewOnMap?: (spotId: string) => void;
  overlayStyles: any;
  closeButtonStyles: any;
  searchLocation?: { lat: number; lng: number } | null;
}

export default function SearchOverlay({
  show,
  visibleSpots,
  selectedSpotId,
  onClose,
  onSearch,
  onSelectSpot,
  onViewOnMap,
  searchLocation,
}: SearchOverlayProps) {
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const handleClose = () => {
    setSearchValue("");
    onClose();
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === "detailed" ? "compact" : "detailed");
  };

  const availableCount = visibleSpots.filter(
    (spot) => spot.status === "Unoccupied"
  ).length;

  // Responsive overlay styles
  const overlayStyles = {
    position: "absolute" as const,
    inset: 0,
    zIndex: 5,
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: "rgba(255,255,255,0.98)",
    backdropFilter: "blur(10px)",
    borderRadius: { xs: 0, sm: 3 }, // No border radius on mobile
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    // Mobile-specific adjustments
    ...(isMobile && {
      borderRadius: 0,
      // Full screen on mobile
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    // Tablet adjustments
    ...(isTablet &&
      !isMobile && {
        inset: { xs: 0, sm: 8 }, // Small margin on tablet
      }),
    // Desktop - original behavior
    ...(!isTablet && {
      p: 3,
    }),
    // Mobile padding
    p: { xs: 2, sm: 3 },
  };

  const closeButtonStyles = {
    backgroundColor: "rgba(0,0,0,0.04)",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.08)",
      transform: "scale(1.1)",
    },
    transition: "all 0.2s ease",
    width: { xs: 40, sm: 36 }, // Larger on mobile for better touch
    height: { xs: 40, sm: 36 },
  };

  return (
    <Slide
      direction={isMobile ? "up" : "left"}
      in={show}
      mountOnEnter
      unmountOnExit
    >
      <Paper sx={overlayStyles} elevation={8}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 1.5, sm: 2 },
            pb: { xs: 1, sm: 1.5 },
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Search Results
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Single toggle button for view mode */}
            {visibleSpots.length > 0 && (
              <IconButton
                onClick={handleViewModeToggle}
                sx={{
                  backgroundColor: "rgba(0,0,0,0.04)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.08)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                  width: { xs: 40, sm: 36 },
                  height: { xs: 40, sm: 36 },
                }}
              >
                {viewMode === "detailed" ? (
                  <ViewModuleIcon sx={{ fontSize: 18 }} />
                ) : (
                  <ViewListIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            )}

            <IconButton onClick={handleClose} sx={closeButtonStyles}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Search bar */}
        <Box
          sx={{
            mb: { xs: 1.5, sm: 2 },
            // Make search bar sticky on mobile when scrolling
            position: { xs: "sticky", sm: "static" },
            top: { xs: 0, sm: "auto" },
            bgcolor: { xs: "rgba(255,255,255,0.95)", sm: "transparent" },
            backdropFilter: { xs: "blur(10px)", sm: "none" },
            py: { xs: 1, sm: 0 },
            mx: { xs: -2, sm: 0 },
            px: { xs: 2, sm: 0 },
            zIndex: { xs: 10, sm: "auto" },
          }}
        >
          <LocationSearchBar
            onSelectLocation={onSearch}
            value={searchValue}
            onClear={handleClearSearch}
          />
        </Box>

        {/* Results list */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            // Better scrolling on mobile
            WebkitOverflowScrolling: "touch",
            // Hide scrollbar on mobile for cleaner look
            "&::-webkit-scrollbar": {
              display: { xs: "none", sm: "auto" },
            },
            scrollbarWidth: { xs: "none", sm: "auto" },
            // Full height to end of screen
            height: "100%",
          }}
        >
          <ParkingResultsList
            spots={visibleSpots}
            selectedSpotId={selectedSpotId}
            onSelectSpot={onSelectSpot}
            onViewOnMap={onViewOnMap}
            searchLocation={searchLocation}
            viewMode={viewMode}
          />
        </Box>
      </Paper>
    </Slide>
  );
}
