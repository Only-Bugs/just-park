import { Box, Stack, Typography, Paper, Container } from "@mui/material";
import parkingImg from "../../assets/images/parking-lot.png";
export default function About() {
  return (
    <Box>
      <Box
        sx={{ bgcolor: "#fff", pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 } }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={{ xs: 6, lg: 12 }}
            alignItems="flex-start"
          >
            <Box flex={1} maxWidth={{ lg: 500 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: "#1a1a1a",
                  mb: 0,
                }}
              >
                We build bridges between{" "}
                <Box component="span" sx={{ color: "#666" }}>
                  commuters
                </Box>{" "}
                and{" "}
                <Box component="span" sx={{ color: "#666" }}>
                  parking
                </Box>
              </Typography>
            </Box>
            <Box flex={1} maxWidth={{ lg: 400 }} sx={{ pt: { lg: 4 } }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  color: "#666",
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                We are building a web-based parking information platform
                designed for Melbourne commuters to make smarter decisions and
                reduce the time spent searching for parking.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "#f8f9fa", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box
            component="img"
            src={parkingImg}
            alt="Modern parking solution"
            sx={{
              width: "100%",
              height: { xs: 300, sm: 400, md: 500 },
              objectFit: "cover",
              borderRadius: 3,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          />
        </Container>
      </Box>
      {}
      <Box sx={{ bgcolor: "#fff", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={{ xs: 6, lg: 12 }}
            alignItems="flex-start"
          >
            {}
            <Box flex={1}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "#1a1a1a",
                  mb: 0,
                }}
              >
                Together we are strong
              </Typography>
            </Box>
            {}
            <Box flex={1.5}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  color: "#666",
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                Our team is always getting bigger, but we all work toward one
                goal: to make parking not only accessible but inevitable for
                commuters everywhere.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  color: "#999",
                  lineHeight: 1.6,
                  mb: 6,
                }}
              >
                Melbourne's CBD faces growing congestion with drivers spending
                up to 17 hours a year searching for parking. We combine
                real-time data with predictive insights to eliminate wasted
                time, reduce emissions, and remove the stress from urban
                parking. Our platform integrates multiple data sources to guide
                drivers to available spots quickly and efficiently.
              </Typography>
              {}
              <Box
                sx={{
                  borderLeft: "4px solid #e0e0e0",
                  pl: 4,
                  py: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                    fontWeight: 400,
                    color: "#1a1a1a",
                    lineHeight: 1.5,
                    mb: 3,
                  }}
                >
                  "Our goal is to build technology that gives Melbourne
                  commuters the ability to create fruitful and efficient parking
                  experiences."
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: "#666" }}>
                      SP
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      FIT5120 - TP 43
                    </Typography>
                    <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>
                      Team Tetrix
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
      {}
      <Box sx={{ bgcolor: "#f8f9fa", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              fontWeight: 700,
              textAlign: "center",
              color: "#1a1a1a",
              mb: { xs: 6, md: 8 },
            }}
          >
            What We've Achieved (and What's Next)
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="stretch"
          >
            {}
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                flex: 1,
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                borderRadius: 3,
              }}
              elevation={0}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "#1a1a1a",
                }}
              >
                Completed
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#333", lineHeight: 1.6 }}
                  >
                    <strong>Awareness Data</strong> – Car ownership and CBD
                    population trends to help commuters understand congestion
                    causes.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#333", lineHeight: 1.6 }}
                  >
                    <strong>Real-Time & Predictive Parking</strong> – Search
                    available parking, filter preferences, and see 1–2 hour
                    predictions.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
            {}
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                flex: 1,
                border: "1px solid #e0e0e0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                borderRadius: 3,
              }}
              elevation={0}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: "#1a1a1a",
                }}
              >
                Coming Soon
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    <strong>Sustainability Features</strong> – CO₂ comparison
                    and green parking recommendations.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    <strong>Enhanced Data Integration</strong> – More sources
                    for improved prediction accuracy.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    <strong>User Accounts</strong> – Save preferences and trip
                    history.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                  >
                    <strong>Expanded Coverage</strong> – Beyond Melbourne CBD.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
