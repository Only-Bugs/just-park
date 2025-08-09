import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/map");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Main content */}
      <Box sx={{ position: "relative", zIndex: 2, p: 3 }}>
        <Typography
          variant="h1"
          sx={{ fontWeight: "bold", color: "#fff", mb: 1, fontSize: "5rem" }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
          Whoops! You’ve parked in the wrong street of the internet.
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "rgba(255,255,255,0.8)" }}
        >
          Don’t panic — towing is free here. We’ll drive you back to the right
          spot in {countdown} second{countdown !== 1 ? "s" : ""}…
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => navigate("/map")}
          sx={{ textTransform: "none" }}
        >
          Take me to the map
        </Button>
      </Box>
    </Box>
  );
}
