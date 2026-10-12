import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  discoverMovies,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  normalizeApiError,
  searchMovies,
} from "../api/tmdb"
import type { AppError, Genre, MovieFilters, MovieSummary } from "../api/types"
import EmptyState from "../components/EmptyState"
import ErrorMessage from "../components/ErrorMessage"
import Filters from "../components/Filters"
import LoadMoreButton from "../components/LoadMoreButton"
import Loader from "../components/Loader"
import MovieGrid from "../components/MovieGrid"
import SearchBar from "../components/SearchBar"
import { useMovies } from "../context/MovieContext"
import useDebounce from "../hooks/useDebounce"
import useInfiniteScroll from "../hooks/useInfiniteScroll"

type Category = "trending" | "now_playing" | "top_rated" | "popular"

const CATEGORY_LABELS: Record<Category, string> = {
  trending: "Trending",
  now_playing: "New Releases",
  top_rated: "Top Rated",
  popular: "Popular",
}

const EMPTY_FILTERS: MovieFilters = { genre: "", year: "", rating: "" }

async function fetchCategory(
  category: Category,
  page: number,
  signal: AbortSignal,
) {
  switch (category) {
    case "trending": {
      const results = await getTrendingMovies(signal)
      return { results, page: 1, total_pages: 1 }
    }
    case "now_playing":
      return getNowPlayingMovies(page, signal)
    case "top_rated":
      return getTopRatedMovies(page, signal)
    case "popular":
      return getPopularMovies(page, signal)
  }
}

/** Browse page with category tabs (Trending, New Releases, Top Rated, Popular), search, and filters. */
export default function MoviesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { genres } = useMovies()

  const initialCategory = (searchParams.get("category") as Category) ?? "trending"
  const [category, setCategory] = useState<Category>(initialCategory)
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<MovieFilters>(EMPTY_FILTERS)

  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAppending, setIsAppending] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  const requestId = useRef(0)
  const debouncedQuery = useDebounce(query.trim(), 500)

  const hasFilters = Boolean(filters.genre || filters.year || filters.rating)
  const isFiltered = Boolean(debouncedQuery || hasFilters)

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      const id = ++requestId.current
      append ? setIsAppending(true) : setIsLoading(true)
      if (!append) setError(null)

      try {
        let data: { results: MovieSummary[]; page: number; total_pages: number }
        const controller = new AbortController()

        if (debouncedQuery) {
          data = await searchMovies(debouncedQuery, nextPage, controller.signal)
        } else if (hasFilters) {
          data = await discoverMovies(filters, nextPage, controller.signal)
        } else {
          data = await fetchCategory(category, nextPage, controller.signal)
        }

        if (id !== requestId.current) return

        setMovies((prev) => {
          if (!append) return data.results
          const seen = new Map(prev.map((m) => [m.id, m]))
          data.results.forEach((m) => seen.set(m.id, m))
          return Array.from(seen.values())
        })
        setPage(data.page)
        setTotalPages(Math.min(data.total_pages, 500))
        setError(null)
      } catch (err) {
        if (id === requestId.current) setError(normalizeApiError(err))
      } finally {
        if (id === requestId.current) {
          setIsLoading(false)
          setIsAppending(false)
        }
      }
    },
    [category, debouncedQuery, filters, hasFilters],
  )

  useEffect(() => {
    setMovies([])
    setPage(0)
    void load(1, false)
  }, [load])

  const loadMore = useCallback(() => {
    if (isLoading || isAppending || page >= totalPages) return
    void load(page + 1, true)
  }, [isLoading, isAppending, load, page, totalPages])

  const sentinelRef = useInfiniteScroll({
    enabled: page < totalPages && !isLoading && !isAppending,
    onLoadMore: loadMore,
  })

  const handleCategory = (cat: Category) => {
    setCategory(cat)
    setQuery("")
    setFilters(EMPTY_FILTERS)
    navigate(`/movies?category=${cat}`, { replace: true })
  }

  const handleSearch = (q: string) => {
    setQuery(q)
    if (q.trim()) setFilters(EMPTY_FILTERS)
  }

  const handleFilters = (f: MovieFilters) => {
    setFilters(f)
    setQuery("")
  }

  const resetFilters = () => setFilters(EMPTY_FILTERS)

  const hasMore = page < totalPages

  return (
    <Box component="main">
      {/* Page header */}
      <Box
        sx={{
          bgcolor: "background.paper",
          background: (theme) =>
            `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 100%)`,
          py: { xs: 5, md: 7 },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Typography
            component="h1"
            variant="h3"
            sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}
          >
            Movies
          </Typography>
          <Typography color="text.secondary">
            Browse all categories or search the collection
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Search + Filters */}
        <Paper
          elevation={4}
          sx={{
            mb: { xs: 4, md: 5 },
            p: { xs: 2, md: 2.5 },
            border: 1,
            borderColor: "divider",
            background: (theme) =>
              `linear-gradient(125deg, ${alpha(theme.palette.primary.main, 0.05)}, transparent 48%)`,
          }}
        >
          <Stack spacing={2}>
            <SearchBar onChange={handleSearch} value={query} />
            <Filters
              filters={filters}
              genres={genres}
              onChange={handleFilters}
              onReset={resetFilters}
            />
          </Stack>
        </Paper>

        {/* Category tabs — hidden when searching/filtering */}
        {!isFiltered && (
          <Tabs
            onChange={(_, val: Category) => handleCategory(val)}
            scrollButtons="auto"
            value={category}
            variant="scrollable"
            sx={{
              mb: 4,
              "& .MuiTabs-indicator": { bgcolor: "primary.main" },
              "& .MuiTab-root": { fontWeight: 700, textTransform: "none" },
            }}
          >
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
              <Tab key={cat} label={CATEGORY_LABELS[cat]} value={cat} />
            ))}
          </Tabs>
        )}

        {/* Grid heading */}
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
              {isFiltered ? "RESULTS" : CATEGORY_LABELS[category].toUpperCase()}
            </Typography>
            <Typography component="h2" variant="h4" sx={{ fontWeight: 800 }}>
              {isFiltered && debouncedQuery
                ? `Search: "${debouncedQuery}"`
                : isFiltered
                  ? "Filtered movies"
                  : CATEGORY_LABELS[category]}
            </Typography>
          </Box>
          {movies.length > 0 && !isLoading && (
            <Typography color="text.secondary" variant="body2">
              {movies.length} movies loaded
            </Typography>
          )}
        </Stack>

        {error ? (
          <ErrorMessage message={error.message} onRetry={() => load(1, false)} />
        ) : isLoading ? (
          <Loader count={12} variant="grid" />
        ) : movies.length ? (
          <>
            <MovieGrid movies={movies} />
            <Box ref={sentinelRef} sx={{ height: 1 }} />
            <LoadMoreButton
              hasMore={hasMore}
              loading={isAppending}
              onClick={loadMore}
            />
          </>
        ) : (
          <EmptyState
            actionLabel={debouncedQuery ? "Clear search" : "Reset filters"}
            description="Try a different title or broaden the filters."
            onAction={debouncedQuery ? () => setQuery("") : resetFilters}
            title="No movies found"
          />
        )}
      </Container>
    </Box>
  )
}
