import {
  AccessTimeRounded,
  AddRounded,
  CheckRounded,
  ImageNotSupportedRounded,
  StarRounded,
} from "@mui/icons-material"
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { getImageUrl, toMovieSummary } from "../api/tmdb"
import type { MovieDetailsResponse } from "../api/types"
import { useFavorites } from "../context/FavoritesContext"

interface MovieDetailsProps {
  movie: MovieDetailsResponse
}

function formatRuntime(runtime: number | null) {
  if (!runtime) return "Runtime TBA"
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return `${hours ? `${hours}h ` : ""}${minutes}m`
}

/** Recreates the reference’s backdrop-led movie profile composition. */
export default function MovieDetails({ movie }: MovieDetailsProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(movie.id)
  const backdrop = getImageUrl(movie.backdrop_path, "original")
  const poster = getImageUrl(movie.poster_path)
  const year = movie.release_date?.slice(0, 4) || "TBA"

  return (
    <Box
      sx={{
        minHeight: { xs: 720, md: 760 },
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        bgcolor: "common.black",
        color: "common.white",
      }}
    >
      {backdrop && (
        <Box
          aria-hidden
          component="img"
          src={backdrop}
          sx={{
            height: "100%",
            inset: 0,
            objectFit: "cover",
            objectPosition: "center 20%",
            position: "absolute",
            width: "100%",
          }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: backdrop
            ? "linear-gradient(90deg, rgba(5,5,7,0.96) 0%, rgba(5,5,7,0.76) 42%, rgba(5,5,7,0.18) 80%), linear-gradient(0deg, #070708 0%, transparent 64%)"
            : "radial-gradient(circle at 76% 20%, rgba(229,9,20,0.26), transparent 40%), #070708",
        }}
      />
      <Container
        maxWidth="xl"
        sx={{ position: "relative", pb: { xs: 7, md: 9 }, pt: 9 }}
      >
        <Stack
          alignItems={{ xs: "center", md: "flex-end" }}
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 6 }}
        >
          <Box
            sx={{
              borderRadius: 1.5,
              boxShadow: 12,
              flex: "0 0 auto",
              overflow: "hidden",
              width: { xs: "56%", sm: 240, md: 285 },
            }}
          >
            {poster ? (
              <Box
                alt={`${movie.title} poster`}
                component="img"
                src={poster}
                sx={{ display: "block", width: "100%" }}
              />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ aspectRatio: "2 / 3", bgcolor: "grey.900" }}
              >
                <ImageNotSupportedRounded sx={{ fontSize: 52 }} />
              </Stack>
            )}
          </Box>
          <Stack
            alignItems={{ xs: "center", md: "flex-start" }}
            spacing={2.5}
            sx={{ maxWidth: 740, textAlign: { xs: "center", md: "left" } }}
          >
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Chip label={year} size="small" />
              <Chip
                icon={<StarRounded />}
                label={movie.vote_average.toFixed(1)}
                size="small"
                sx={{
                  bgcolor: "primary.main",
                  color: "common.white",
                  "& .MuiChip-icon": { color: "common.white" },
                }}
              />
              <Chip
                icon={<AccessTimeRounded />}
                label={formatRuntime(movie.runtime)}
                size="small"
              />
            </Stack>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: { xs: "3.5rem", sm: "5rem", md: "6.5rem" },
                lineHeight: 0.88,
                textShadow: "0 5px 30px rgba(0,0,0,0.7)",
              }}
            >
              {movie.title}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {movie.genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha("#ffffff", 0.38),
                    color: "common.white",
                  }}
                />
              ))}
            </Stack>
            <Typography
              sx={{
                color: alpha("#ffffff", 0.8),
                fontSize: { xs: "1rem", md: "1.08rem" },
                lineHeight: 1.75,
              }}
            >
              {movie.overview || "No overview is available for this movie."}
            </Typography>
            <Button
              color={favorite ? "inherit" : "primary"}
              onClick={() => toggleFavorite(toMovieSummary(movie))}
              startIcon={favorite ? <CheckRounded /> : <AddRounded />}
              variant={favorite ? "outlined" : "contained"}
            >
              {favorite ? "Remove from favorites" : "Add to favorites"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
