import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import style from "./style"; // Assuming you've renamed to style.ts

export default function Header() {
  return (
    <AppBar position="static" sx={style.appBar}>
      <Toolbar sx={style.toolbar}>
        <Typography variant="h6" sx={style.logo}>
          JustPark.
        </Typography>

        <Box sx={style.navLinks}>
          <Typography variant="body1" sx={style.link}>
            Home
          </Typography>
          <Typography variant="body1" sx={style.link}>
            Insight
          </Typography>
          <Typography variant="body1" sx={style.link}>
            Parking
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
