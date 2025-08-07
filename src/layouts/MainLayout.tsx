import { Box } from "@mui/material";
import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9", py: 4 }}>
      <Header />
      {children}
      <Footer />
    </Box>
  );
}
