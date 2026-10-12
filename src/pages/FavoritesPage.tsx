import { Box, Container, Stack, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import MovieGrid from "../components/MovieGrid"
import { useFavorites } from "../context/FavoritesContext"

/** Renders the user’s persisted movie collection and its empty state. */
export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const navigate = useNavigate()

  return (
    <Box component="main">
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          borderBottom: 1,
          borderColor: "divider",
          background:
            "radial-gradient(circle at 85% 5%, rgba(229,9,20,0.18), transparent 28%)",
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography
              color="primary"
              fontWeight={800}
              letterSpacing="0.12em"
              variant="overline"
            >
              YOUR COLLECTION
            </Typography>
            <Typography component="h1" variant="h2">
              Favorite movies
            </Typography>
            <Typography color="text.secondary">
              The films you saved, ready whenever you are.
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        {favorites.length ? (
          <MovieGrid movies={favorites} />
        ) : (
          <EmptyState
            actionLabel="Explore movies"
            description="Tap the heart on any movie card or details page to build your personal watchlist."
            onAction={() => navigate("/")}
            title="Your favorites are waiting"
          />
        )}
      </Container>
    </Box>
  )
}
