import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Fab,
  CircularProgress,
  Typography,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import L from "leaflet";
import ParkingMap from "../../components/map/ParkingMap";
import HeroSection from "../../components/home/HeroSection";
import SearchOverlay from "../../components/map/SearchOverlay";
import { useMapControls } from "../../context/MapControlsContext";
import type { ParkingSpot } from "../../types/parking";
import styles from "./styles";

type MapMode = "browse" | "searching" | "spotSelected";

export default function MapScreen() {
  const {
    loading,
    error,
    refresh,
    filteredSpots,
    searchLocation,
    setSearchLocation,
  } = useMapControls();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [visibleSpots, setVisibleSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [mode, setMode] = useState<MapMode>("browse");
  const [hasSearched, setHasSearched] = useState(false);

  // Memoize filtered spots to prevent unnecessary re-renders
  const memoizedFilteredSpots = useMemo(() => filteredSpots, [filteredSpots]);

  useEffect(() => {
    if (!loading && memoizedFilteredSpots.length > 0) {
      setVisibleSpots(memoizedFilteredSpots);
    }
  }, [memoizedFilteredSpots, loading]);

  // Optimized bounds change handler with debouncing
  const handleBoundsChange = useCallback(
    (bounds: L.LatLngBounds) => {
      // Use requestAnimationFrame to debounce map updates
      requestAnimationFrame(() => {
        const spotsInBounds = memoizedFilteredSpots.filter((spot) =>
          bounds.contains([spot.lat, spot.lng])
        );
        setVisibleSpots(spotsInBounds);
      });
    },
    [memoizedFilteredSpots]
  );

  // Optimized search handler
  const handleSearch = useCallback(
    (location: { lat: number; lng: number }) => {
      setSearchLocation(location);
      setMode("searching");
      setHasSearched(true);

      // Filter spots near search location efficiently
      const nearbySpots = memoizedFilteredSpots.filter(
        (spot) =>
          Math.abs(spot.lat - location.lat) < 0.003 &&
          Math.abs(spot.lng - location.lng) < 0.003
      );
      setVisibleSpots(nearbySpots);
    },
    [memoizedFilteredSpots, setSearchLocation]
  );

  // Optimized spot selection - no map movement, just highlight
  const handleSelectSpot = useCallback((spotId: string) => {
    setSelectedSpotId(spotId);
    // Don't trigger map movement for faster selection
  }, []);

  // Optimized view on map - only move map when explicitly requested
  const handleViewOnMap = useCallback(
    (spotId: string) => {
      const spot = memoizedFilteredSpots.find((s) => s.id === spotId);
      if (!spot) return;

      // Batch state updates to prevent multiple re-renders
      setSelectedSpotId(spotId);

      // Use setTimeout to debounce map movement
      setTimeout(() => {
        setSearchLocation({ lat: spot.lat, lng: spot.lng });
      }, 100);

      setMode("spotSelected");
    },
    [memoizedFilteredSpots, setSearchLocation]
  );

  // Optimized map click handler
  const handleSpotClickOnMap = useCallback(
    (spot: ParkingSpot) => {
      // Fast selection without immediate map movement
      setSelectedSpotId(spot.id);

      // Auto-open search overlay if not already open
      if (!showSearchOverlay) {
        setShowSearchOverlay(true);
        setMode("searching");
        setHasSearched(true);

        // Debounce the search location update
        setTimeout(() => {
          setSearchLocation({ lat: spot.lat, lng: spot.lng });
        }, 50);
      }
    },
    [showSearchOverlay, setSearchLocation]
  );

  const handleCloseOverlay = useCallback(() => {
    setShowSearchOverlay(false);
    setMode("browse");
    setHasSearched(false);
    setSelectedSpotId(null);
    setVisibleSpots(memoizedFilteredSpots);
  }, [memoizedFilteredSpots]);

  const handleOpenSearch = useCallback(() => {
    setShowSearchOverlay(true);
    setMode("searching");
    setHasSearched(false);
  }, []);

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography>Loading parking data...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={styles.container}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: 2,
            p: 4,
          }}
        >
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            <Typography variant="h6">Failed to load parking data</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={refresh}
              sx={{ mt: 2 }}
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Map Section - Always show all visible spots */}
      <Box sx={styles.mapSection}>
        <ParkingMap
          spots={visibleSpots}
          onBoundsChange={handleBoundsChange}
          onSpotClick={handleSpotClickOnMap}
          searchLocation={searchLocation}
          selectedSpotId={selectedSpotId}
        />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          ...styles.heroSection,
          // Add class for mobile overlay state
          ...(isMobile &&
            showSearchOverlay && {
              // On mobile, when search is open, hero section becomes full overlay
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1300,
              backgroundColor: "transparent",
            }),
        }}
        className={isMobile && showSearchOverlay ? "search-active" : ""}
      >
        {/* Only show hero content when not searching on mobile */}
        {(!isMobile || !showSearchOverlay) && <HeroSection />}

        {/* Search FAB - hide when overlay is open on mobile */}
        {(!showSearchOverlay || !isMobile) && (
          <Fab
            color="primary"
            onClick={handleOpenSearch}
            sx={styles.fab}
            aria-label="Open search"
          >
            <SearchIcon />
          </Fab>
        )}

        {/* Search Overlay */}
        <SearchOverlay
          show={showSearchOverlay}
          visibleSpots={hasSearched ? visibleSpots : []}
          selectedSpotId={selectedSpotId}
          onClose={handleCloseOverlay}
          onSearch={handleSearch}
          onSelectSpot={handleSelectSpot}
          onViewOnMap={handleViewOnMap}
          searchLocation={searchLocation}
          overlayStyles={styles.overlay}
          closeButtonStyles={styles.closeButton}
        />
      </Box>
    </Box>
  );
}
