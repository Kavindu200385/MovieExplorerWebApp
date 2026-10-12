import {
  FavoriteBorderRounded,
  FavoriteRounded,
  ImageNotSupportedRounded,
  StarRounded,
} from "@mui/icons-material"
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import { getImageUrl } from "../api/tmdb"
import type { MovieSummary } from "../api/types"
import { useFavorites } from "../context/FavoritesContext"

interface MovieCardProps {
  movie: MovieSummary
}

/** Displays a cinematic poster tile with rating and independent favorite action. */
export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(movie.id)
  const poster = getImageUrl(movie.poster_path)
  const year = movie.release_date?.slice(0, 4) || "TBA"

  return (
    <Card
      sx={{
        bgcolor: "transparent",
        borderRadius: 0.5,
        boxShadow: "none",
        overflow: "visible",
        position: "relative",
        transition: "transform 180ms ease",
        "&:hover": { transform: "translateY(-6px)" },
        "&:hover .movie-overlay": { opacity: 1 },
      }}
    >
      <CardActionArea
        aria-label={`View details for ${movie.title}`}
        onClick={() => navigate(`/movie/${movie.id}`)}
        sx={{ borderRadius: 0.5, overflow: "hidden" }}
      >
        <Box
          sx={{
            aspectRatio: "2 / 3",
            bgcolor: "background.paper",
            boxShadow: 5,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {poster ? (
            <Box
              alt={`${movie.title} poster`}
              component="img"
              loading="lazy"
              src={poster}
              sx={{
                display: "block",
                height: "100%",
                objectFit: "cover",
                width: "100%",
              }}
            />
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ height: "100%", color: "text.secondary", px: 2 }}
            >
              <ImageNotSupportedRounded fontSize="large" />
              <Typography align="center" variant="caption">
                Poster unavailable
              </Typography>
            </Stack>
          )}
          <Box
            className="movie-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              opacity: { xs: 1, md: 0.72 },
              transition: "opacity 180ms ease",
              background:
                "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.9) 100%)",
            }}
          />
          <Chip
            color="primary"
            icon={<StarRounded />}
            label={movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}
            size="small"
            sx={{
              position: "absolute",
              bottom: 10,
              left: 10,
              color: "common.white",
              "& .MuiChip-icon": { color: "common.white" },
            }}
          />
        </Box>
      </CardActionArea>
      <Tooltip title={favorite ? "Remove from favorites" : "Add to favorites"}>
        <IconButton
          aria-label={
            favorite
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
          onClick={(event) => {
            event.stopPropagation()
            toggleFavorite(movie)
          }}
          size="small"
          sx={{
            position: "absolute",
            right: 9,
            top: 9,
            color: favorite ? "primary.main" : "common.white",
            bgcolor: alpha("#000000", 0.66),
            "&:hover": {
              bgcolor: alpha("#000000", 0.9),
              transform: "scale(1.06)",
            },
          }}
        >
          {favorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
        </IconButton>
      </Tooltip>
      <Stack spacing={0.25} sx={{ pt: 1.25 }}>
        <Typography
          noWrap
          title={movie.title}
          variant="subtitle1"
          sx={{ fontWeight: 750, lineHeight: 1.3 }}
        >
          {movie.title}
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {year}
        </Typography>
      </Stack>
    </Card>
  )
}
