import { Box, Button, Typography } from "@mui/material";
import type { ParkingSpot } from "../../types/parking";
type Props = {
  spot: ParkingSpot;
  onClose: () => void;
};
export default function ParkingDetailsDrawer({ spot, onClose }: Props) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "40vh",
        bgcolor: "background.paper",
        boxShadow: 3,
        p: 3,
        overflowY: "auto",
        zIndex: 999,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Parking Spot Details</Typography>
        <Button size="small" onClick={onClose}>
          Close
        </Button>
      </Box>
      {Object.entries(spot).map(([key, value]) => (
        <Box key={key} display="flex" mb={1}>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ width: 120, textTransform: "capitalize" }}
          >
            {key}:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color:
                key === "status"
                  ? value === "Unoccupied"
                    ? "green"
                    : value === "Present"
                    ? "red"
                    : "inherit"
                  : "inherit",
            }}
          >
            {value === null || value === undefined ? "N/A" : String(value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
