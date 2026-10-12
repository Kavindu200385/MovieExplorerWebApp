import { ArrowBackRounded, HomeRounded } from "@mui/icons-material"
import { Box, Button, Stack, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/** Handles unknown routes with a branded cinematic recovery screen. */
export default function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: 3,
        textAlign: "center",
        background:
          "radial-gradient(circle at 50% 30%, rgba(229,9,20,0.2), transparent 32%)",
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <Typography
          color="primary"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: { xs: "8rem", md: "13rem" },
            lineHeight: 0.72,
            textShadow: "0 0 60px rgba(229,9,20,0.2)",
          }}
        >
          404
        </Typography>
        <Typography component="h1" variant="h3">
          This scene didn’t make the final cut
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
          The page you’re looking for has moved, ended, or never existed.
        </Typography>
        <Button
          onClick={() => navigate(isAuthenticated ? "/" : "/login")}
          startIcon={isAuthenticated ? <HomeRounded /> : <ArrowBackRounded />}
          variant="contained"
        >
          {isAuthenticated ? "Back to movies" : "Go to login"}
        </Button>
      </Stack>
    </Box>
  )
}
