import { Box, Typography } from "@mui/material";
import style from "./style";
export default function Footer() {
  return (
    <Box component="footer" sx={style.footer}>
      <Typography variant="body2" sx={style.copy}>
        © {new Date().getFullYear()} JustPark. All rights reserved.
      </Typography>
    </Box>
  );
}
