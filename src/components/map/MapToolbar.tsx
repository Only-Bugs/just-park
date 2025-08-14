import {
  Paper,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Box,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
interface MapToolbarProps {
  lastUpdated: Date | null;
  showAvailableOnly: boolean;
  onRefresh: () => void;
  onToggleAvailableOnly: (show: boolean) => void;
}
export default function MapToolbar({
  lastUpdated,
  showAvailableOnly,
  onRefresh,
  onToggleAvailableOnly,
}: MapToolbarProps) {
  return (
    <Paper
      sx={{
        position: "absolute",
        bottom: 16,
        left: 16,
        p: 2,
        bgcolor: "rgba(255,255,255,0.95)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minWidth: 200,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {}
      <Box
        onClick={onRefresh}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          p: 0.5,
          borderRadius: 1,
          "&:hover": {
            bgcolor: "rgba(0,0,0,0.04)",
          },
          transition: "all 0.2s ease",
        }}
        title="Click to refresh data"
      >
        <IconButton size="small" sx={{ p: 0 }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
        <Typography variant="caption">
          {lastUpdated
            ? `Updated: ${lastUpdated.toLocaleTimeString()}`
            : "No data"}
        </Typography>
      </Box>
      {}
      <FormControlLabel
        control={
          <Switch
            checked={showAvailableOnly}
            onChange={(e) => onToggleAvailableOnly(e.target.checked)}
            size="small"
          />
        }
        label={<Typography variant="caption">Show available only</Typography>}
        sx={{
          m: 0,
          "& .MuiFormControlLabel-label": {
            fontSize: "0.75rem",
          },
        }}
      />
    </Paper>
  );
}
