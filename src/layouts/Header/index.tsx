import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useState, useContext } from "react";
import { MapControlsContext } from "../../context/MapControlsContext";
import style from "./style";

export default function Header() {
  const location = useLocation();
  const isMapPage = location.pathname === "/";
  const isAbout = location.pathname.startsWith("/about");
  const isInsights = location.pathname.startsWith("/insights");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Use context directly to avoid conditional hook calls
  const mapControls = useContext(MapControlsContext);

  // Only show map controls when context is available and on map page
  const showMapControls = isMapPage && mapControls;

  // Close menu when route changes
  useEffect(() => {
    setAnchorEl(null);
  }, [location.pathname]);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleRefresh = () => {
    mapControls?.refresh?.();
    handleClose();
  };

  return (
    <AppBar position="static" sx={style.appBar}>
      <Toolbar sx={style.toolbar}>
        <Typography variant="h6" sx={style.logo}>
          JustPark.
        </Typography>

        <Box sx={style.navLinks}>
          <Typography
            component={RouterLink}
            to="/"
            sx={{ ...style.link, ...(isMapPage && style.activeLink) }}
          >
            Home
          </Typography>

          <Typography
            component={RouterLink}
            to="/about"
            sx={{ ...style.link, ...(isAbout && style.activeLink) }}
          >
            About
          </Typography>

          {/* <Typography
            component={RouterLink}
            to="/insights"
            sx={{ ...style.link, ...(isInsights && style.activeLink) }}
          >
            Insights
          </Typography> */}

          {showMapControls && (
            <IconButton
              onClick={handleSettingsClick}
              sx={{ color: "#555", ml: 1 }}
              title="Map Settings"
              aria-controls={anchorEl ? "map-settings-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? "true" : undefined}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {showMapControls && (
          <Menu
            id="map-settings-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{ sx: { minWidth: 220, mt: 1 } }}
          >
            <MenuItem onClick={handleRefresh}>
              <RefreshIcon sx={{ mr: 1, fontSize: 20 }} />
              <Box>
                <Typography variant="body2">Refresh Data</Typography>
                {mapControls.lastUpdated && (
                  <Typography variant="caption" color="text.secondary">
                    Last: {mapControls.lastUpdated.toLocaleTimeString()}
                  </Typography>
                )}
              </Box>
            </MenuItem>

            <Divider />

            <Box sx={{ px: 2, py: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mapControls.showAvailableOnly}
                    onChange={(e) =>
                      mapControls.setShowAvailableOnly(e.target.checked)
                    }
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">Show available only</Typography>
                }
                sx={{ m: 0, width: "100%" }}
              />
            </Box>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
}
