import { Box, Typography } from "@mui/material";
import heroStyles from "./style";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function HeroSection({ children }: Props) {
  return (
    <Box sx={heroStyles.hero}>
      <Box sx={heroStyles.overlay} />

      <Box sx={heroStyles.blurBox}>
        <Typography variant="h3" sx={heroStyles.heading}>
          Find available parkings in Melbourne CBD
        </Typography>

        {children && <Box sx={{ mt: 2 }}>{children}</Box>}
      </Box>
    </Box>
  );
}
