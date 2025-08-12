import type { SxProps, Theme } from "@mui/material";

const headerHeight = 64;

const styles: Record<string, SxProps<Theme>> = {
  container: {
    height: `calc(100vh - ${headerHeight}px)`,
    display: "flex",
    flexDirection: { xs: "column", lg: "row" }, // Stack on mobile, side-by-side on desktop
    gap: { xs: 0, sm: 1, lg: 2 },
    px: { xs: 0, sm: 1, lg: 2 }, // No padding on mobile
    marginTop: { xs: 0, sm: "8px" },
    boxSizing: "border-box",
  },

  mapSection: {
    flex: { xs: "1 1 60%", lg: "0 0 70%" }, // 60% height on mobile, 70% width on desktop
    borderRadius: { xs: 0, sm: 2, lg: 3 },
    overflow: "hidden",
    boxShadow: {
      xs: "none",
      sm: "0 2px 8px rgba(0,0,0,0.06)",
      lg: "0 4px 20px rgba(0,0,0,0.08)",
    },
    height: { xs: "auto", lg: "100%" },
    order: { xs: 1, lg: 0 }, // Map first on mobile
  },

  heroSection: {
    flex: { xs: "1 1 40%", lg: "0 0 30%" }, // 40% height on mobile, 30% width on desktop
    position: "relative",
    height: { xs: "auto", lg: "100%" },
    minHeight: { xs: "300px", sm: "400px", lg: "auto" },
    order: { xs: 2, lg: 0 }, // Hero section second on mobile
    // On mobile, make it a proper overlay when search is active
    "@media (max-width: 900px)": {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      // Hide hero background when overlay is shown
      "&.search-active": {
        backgroundColor: "transparent",
        "& > *:not([data-overlay])": {
          display: "none",
        },
      },
    },
  },

  fab: {
    position: "absolute",
    bottom: { xs: 16, sm: 20, lg: 24 },
    right: { xs: 16, sm: 20, lg: 24 },
    zIndex: 3,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    width: { xs: 56, sm: 64 }, // Larger on mobile
    height: { xs: 56, sm: 64 },
    "&:hover": {
      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
      transform: "scale(1.05)",
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: {
      xs: "0 4px 12px rgba(0,0,0,0.15)",
      sm: "0 6px 20px rgba(0,0,0,0.15)",
      lg: "0 8px 25px rgba(0,0,0,0.15)",
    },
  },

  overlay: {
    position: "absolute",
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(255,255,255,0.98)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",

    // Mobile styles - full screen
    [(theme) => theme.breakpoints.down("md")]: {
      inset: 0,
      borderRadius: 0,
      p: 2,
    },

    // Tablet styles - with margins
    [(theme) => theme.breakpoints.between("md", "lg")]: {
      inset: 8,
      borderRadius: 2,
      p: 2.5,
    },

    // Desktop styles - original
    [(theme) => theme.breakpoints.up("lg")]: {
      inset: 0,
      borderRadius: 3,
      p: 3,
    },
  },

  closeButton: {
    backgroundColor: "rgba(0,0,0,0.04)",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.08)",
      transform: "scale(1.1)",
    },
    transition: "all 0.2s ease",
    width: { xs: 40, sm: 36 }, // Larger touch target on mobile
    height: { xs: 40, sm: 36 },
  },

  resultsContainer: {
    flex: 1,
    overflowY: "auto",
    // Better mobile scrolling
    WebkitOverflowScrolling: "touch",
    // Custom scrollbar styling
    "&::-webkit-scrollbar": {
      width: { xs: 0, sm: 6 }, // Hide on mobile
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: 3,
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.3)",
      },
    },
    scrollbarWidth: { xs: "none", sm: "thin" }, // Firefox
  },

  // Mobile-specific overlay animations
  mobileOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1300, // Above everything
    backgroundColor: "rgba(255,255,255,0.98)",
    backdropFilter: "blur(10px)",
  },

  // Responsive breakpoint helpers
  hideOnMobile: {
    display: { xs: "none", md: "block" },
  },

  hideOnDesktop: {
    display: { xs: "block", md: "none" },
  },

  responsiveText: {
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },

  responsivePadding: {
    p: { xs: 1, sm: 2, lg: 3 },
  },

  responsiveMargin: {
    m: { xs: 0.5, sm: 1, lg: 1.5 },
  },
};

export default styles;
