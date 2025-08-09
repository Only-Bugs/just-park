import type { SxProps, Theme } from "@mui/material";

const headerHeight = 64;

const styles: Record<string, SxProps<Theme>> = {
  container: {
    height: `calc(100vh - ${headerHeight}px)`,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    px: 2,
    marginTop: "8px",
    boxSizing: "border-box",
  },
  mapSection: {
    flex: "0 0 70%",
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: 2,
    height: "100%",
  },
  heroSection: {
    flex: "0 0 30%",
    position: "relative",
    height: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 3,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    p: 2,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  resultsContainer: {
    flex: 1,
    overflowY: "auto",
  },
};

export default styles;
