import {
  AddRounded,
  CheckRounded,
  InfoOutlined,
  StarRounded,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import { getImageUrl } from "../api/tmdb"
import EmptyState from "../components/EmptyState"
import ErrorMessage from "../components/ErrorMessage"
import Filters from "../components/Filters"
import LoadMoreButton from "../components/LoadMoreButton"
import Loader from "../components/Loader"
import MovieGrid from "../components/MovieGrid"
import PosterFan from "../components/PosterFan"
import SearchBar from "../components/SearchBar"
import { useFavorites } from "../context/FavoritesContext"
import { useMovies } from "../context/MovieContext"
import useInfiniteScroll from "../hooks/useInfiniteScroll"

/** Combines the featured hero, search/discovery controls, and movie catalog. */
export default function HomePage() {
  const {
    trending,
    genres,
    results,
    query,
    filters,
    mode,
    page,
    totalPages,
    isLoading,
    isAppending,
    error,
    setSearchQuery,
    setFilters,
    resetFilters,
    loadMore,
    retry,
  } = useMovies()
  const { isFavorite, toggleFavorite } = useFavorites()
  const navigate = useNavigate()
  const hero =
    trending.find((movie) => movie.backdrop_path && movie.overview) ??
    trending[0]
  const heroBackdrop = getImageUrl(hero?.backdrop_path, "original")
  const heroFavorite = hero ? isFavorite(hero.id) : false
  const hasMore = mode !== "idle" && page < totalPages
  const sentinelRef = useInfiniteScroll({
    enabled: hasMore && !isLoading && !isAppending,
    onLoadMore: loadMore,
  })
  const displayedMovies = mode === "idle" ? trending : results
  const showInitialSkeleton =
    isLoading || (mode === "idle" && !trending.length && !error)
  const heading =
    mode === "search"
      ? `Search results for “${query.trim()}”`
      : mode === "discover"
        ? "Filtered movies"
        : "Trending movies"

  return (
    <Box component="main">
      <Box
        sx={{
          minHeight: { xs: 700, md: 860 },
          display: "flex",
          alignItems: "flex-end",
          position: "relative",
          bgcolor: "common.black",
          color: "common.white",
        }}
      >
        {heroBackdrop && (
          <Box
            aria-hidden
            component="img"
            src={heroBackdrop}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: { xs: "64% center", md: "74% center" },
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: heroBackdrop
              ? "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.97) 34%, rgba(0,0,0,0.26) 78%), linear-gradient(0deg, #000 0%, transparent 54%)"
              : "radial-gradient(circle at 76% 24%, rgba(229,9,20,0.28), transparent 34%), #070708",
          }}
        />
        <Container
          maxWidth="xl"
          sx={{ position: "relative", pb: { xs: 10, md: 14 }, pt: 11 }}
        >
          <Stack spacing={3} sx={{ maxWidth: 660 }}>
            <Chip
              color="primary"
              label="TRENDING THIS WEEK"
              size="small"
              sx={{ alignSelf: "flex-start", color: "common.white" }}
            />
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: { xs: "3.2rem", sm: "4.8rem", md: "6.4rem" },
                lineHeight: 0.94,
                maxWidth: 610,
                textShadow: "0 8px 38px rgba(0,0,0,0.72)",
              }}
            >
              {hero?.title || "DISCOVER YOUR NEXT FAVORITE FILM"}
            </Typography>
            {hero && (
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={1.5}
              >
                <Stack alignItems="center" direction="row" spacing={0.5}>
                  <StarRounded color="primary" fontSize="small" />
                  <Typography fontWeight={750}>
                    {hero.vote_average.toFixed(1)}
                  </Typography>
                </Stack>
                <Typography color={alpha("#ffffff", 0.65)}>
                  {hero.release_date?.slice(0, 4) || "Coming soon"}
                </Typography>
              </Stack>
            )}
            <Typography
              sx={{
                color: alpha("#ffffff", 0.74),
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                fontSize: { xs: "0.98rem", md: "1.08rem" },
                lineHeight: 1.75,
              }}
            >
              {hero?.overview ||
                "Explore weekly trends, search the collection, and save the movies you love."}
            </Typography>
            {hero && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  onClick={() => navigate(`/movie/${hero.id}`)}
                  startIcon={<InfoOutlined />}
                  variant="contained"
                >
                  View details
                </Button>
                <Button
                  onClick={() => toggleFavorite(hero)}
                  startIcon={heroFavorite ? <CheckRounded /> : <AddRounded />}
                  sx={{
                    borderColor: alpha("#ffffff", 0.35),
                    color: "common.white",
                  }}
                  variant="outlined"
                >
                  {heroFavorite ? "In favorites" : "Add to favorites"}
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 10, bgcolor: "background.default" }}>
        <Paper
          elevation={8}
          sx={{
            mt: { xs: -4, md: -5 },
            mb: { xs: 6, md: 8 },
            p: { xs: 2, md: 2.5 },
            position: "relative",
            border: 1,
            borderColor: "divider",
            background:
              "linear-gradient(125deg, rgba(229,9,20,0.08), transparent 48%), #09090a",
            color: "common.white",
          }}
        >
          <Stack spacing={2}>
            <SearchBar onChange={setSearchQuery} value={query} />
            <Filters
              filters={filters}
              genres={genres}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </Stack>
        </Paper>

        <Stack
          alignItems={{ sm: "flex-end" }}
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              color="primary"
              fontWeight={800}
              letterSpacing="0.12em"
              variant="overline"
            >
              NOW SHOWING
            </Typography>
            <Typography component="h2" variant="h3">
              {heading}
            </Typography>
          </Box>
          {mode !== "idle" && !isLoading && (
            <Typography color="text.secondary" variant="body2">
              {displayedMovies.length} movies loaded
            </Typography>
          )}
        </Stack>

        {error ? (
          <ErrorMessage message={error.message} onRetry={retry} />
        ) : showInitialSkeleton ? (
          <Loader count={12} variant="grid" />
        ) : displayedMovies.length ? (
          <>
            <MovieGrid movies={displayedMovies} />
            {mode !== "idle" && (
              <>
                <Box ref={sentinelRef} sx={{ height: 1 }} />
                <LoadMoreButton
                  hasMore={hasMore}
                  loading={isAppending}
                  onClick={loadMore}
                />
              </>
            )}
          </>
        ) : (
          <EmptyState
            actionLabel={mode === "discover" ? "Reset filters" : "Clear search"}
            description="Try a different title or broaden the filters to find more films."
            onAction={
              mode === "discover" ? resetFilters : () => setSearchQuery("")
            }
            title="No movies found"
          />
        )}
      </Container>
      <PosterFan movies={trending} />
    </Box>
  )
}
