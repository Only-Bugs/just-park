import { useState } from "react";
import { Box, Fab, Paper, IconButton, Typography, Slide } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import ParkingMap from "../../components/map/ParkingMap";
import type { ParkingSpot } from "../../types/parking";
import HeroSection from "../../components/home/HeroSection";
import LocationSearchBar from "../../components/forms/search/LocationSearchBar";

import styles from "./styles";

export default function MapScreen() {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [visibleSpots, setVisibleSpots] = useState<ParkingSpot[]>([]);

  const handleSearch = (location: { lat: number; lng: number }) => {
    setSearchLocation(location);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.mapSection}>
        <ParkingMap
          onSelectSpot={(spot) => setSelectedSpotId(spot.id)}
          selectedSpotId={selectedSpotId}
          showAvailableOnly={false}
          searchLocation={searchLocation}
          onVisibleSpotsChange={setVisibleSpots}
        />
      </Box>

      <Box sx={styles.heroSection}>
        <HeroSection />

        <Fab
          color="primary"
          onClick={() => setShowResults(true)}
          sx={styles.fab}
        >
          <SearchIcon />
        </Fab>

        <Slide direction="up" in={showResults} mountOnEnter unmountOnExit>
          <Paper sx={styles.overlay} elevation={4}>
            <IconButton
              onClick={() => {
                setShowResults(false);
                setSelectedSpotId(null);
              }}
              sx={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ mb: 2 }}>
              <LocationSearchBar
                onSelectLocation={handleSearch}
                onTyping={() => setSelectedSpotId(null)}
              />
            </Box>

            <Box sx={styles.resultsContainer}>
              {visibleSpots.map((spot) => (
                <Box
                  key={spot.id}
                  sx={{
                    p: 1,
                    mb: 1,
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor:
                      spot.id === selectedSpotId ? "#e0f7fa" : "#f5f5f5",
                    "&:hover": { backgroundColor: "#e0f7fa" },
                  }}
                  onClick={() => setSelectedSpotId(spot.id)}
                >
                  <Typography variant="body2">
                    {spot.id} – {spot.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Slide>
      </Box>
    </Box>
  );
}
