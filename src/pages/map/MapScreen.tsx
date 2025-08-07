import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import ParkingMap from "../../components/map/ParkingMap";
import ParkingDetailsDrawer from "../../components/map/ParkingDetailsDrawer";
import type { ParkingSpot } from "../../types/parking";
import HeroSection from "../../components/home/HeroSection";
import LocationSearchBar from "../../components/forms/search/LocationSearchBar";

export default function MapScreen() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSearch = (location: { lat: number; lng: number }) => {
    setSearchLocation(location);
  };

  return (
    <>
      <HeroSection>
        <LocationSearchBar onSelectLocation={handleSearch} />
      </HeroSection>

      <Container maxWidth="xl" sx={{ paddingY: 4 }}>
        <Typography variant="h4" gutterBottom>
          Melbourne Parking Map
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
          }
          label="Show only available parking spots"
          sx={{ mb: 2 }}
        />

        <Box sx={{ height: "75vh", borderRadius: 2, overflow: "hidden" }}>
          <ParkingMap
            onSelectSpot={setSelectedSpot}
            showAvailableOnly={showAvailableOnly}
            searchLocation={searchLocation}
          />
        </Box>

        {selectedSpot && (
          <ParkingDetailsDrawer
            spot={selectedSpot}
            onClose={() => setSelectedSpot(null)}
          />
        )}
      </Container>
    </>
  );
}
