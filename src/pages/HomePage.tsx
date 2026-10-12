import {
  AddRounded,
  CheckRounded,
  CheckCircleOutlineRounded,
  InfoOutlined,
  StarRounded,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getNowPlayingMovies,
  getImageUrl,
  getPopularMovies,
  getTopRatedMovies,
} from "../api/tmdb"
import type { MovieSummary } from "../api/types"
import MovieRow from "../components/MovieRow"
import PosterFan from "../components/PosterFan"
import { useAuthFavorite } from "../context/FavoritesContext"
import { useMovies } from "../context/MovieContext"
import useCountUp from "../hooks/useCountUp"

const HERO_INTERVAL_MS = 6000

const STATS = [
  { displayValue: 2.3, suffix: " M", label: "Current Users" },
  { displayValue: 47,  suffix: "K",  label: "Online Users"  },
  { displayValue: 836, suffix: "K",  label: "Pro Users"     },
  { displayValue: 358, suffix: "K",  label: "New Users"     },
]

function StatNumber({
  displayValue,
  suffix,
  label,
  active,
}: {
  displayValue: number
  suffix: string
  label: string
  active: boolean
}) {
  const count = useCountUp(displayValue, 1800, active)
  const formatted =
    displayValue % 1 !== 0 ? count.toFixed(1) : String(Math.round(count))
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography
        sx={{
          fontSize: { xs: "3rem", sm: "3.8rem", md: "5rem" },
          fontWeight: 800,
          lineHeight: 1,
          color: "text.primary",
        }}
      >
        {formatted}
        {suffix}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.9rem",
          color: "text.secondary",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </Typography>
    </Stack>
  )
}

/** Fetches a static first-page movie list and tracks its loading state. */
function useMovieList(
  fetcher: () => Promise<{ results: MovieSummary[] }>,
) {
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetcher()
      .then((data) => {
        if (!controller.signal.aborted) {
          setMovies(data.results)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  return { movies, loading }
}

/** Home page: shuffling hero banner, four horizontal category rows, PosterFan, stats, and newsletter. */
export default function HomePage() {
  const { trending } = useMovies()
  const { isFavorite, guardedToggle } = useAuthFavorite()
  const navigate = useNavigate()

  const heroMovies = trending
    .filter((m) => m.backdrop_path && m.overview)
    .slice(0, 5)

  const [heroIndex, setHeroIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.max(heroMovies.length, 1))
    }, HERO_INTERVAL_MS)
  }

  useEffect(() => {
    if (!heroMovies.length) return
    setHeroIndex(0)
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // heroMovies.length is the right dependency — restart when list populates
  }, [heroMovies.length])

  const goToSlide = (index: number) => {
    setHeroIndex(index)
    startTimer()
  }

  const hero = heroMovies[heroIndex] ?? heroMovies[0]
  const heroBackdrop = getImageUrl(hero?.backdrop_path, "original")
  const heroFavorite = hero ? isFavorite(hero.id) : false

  const nowPlaying = useMovieList(() => getNowPlayingMovies(1))
  const topRated = useMovieList(() => getTopRatedMovies(1))
  const popular = useMovieList(() => getPopularMovies(1))

  return (
    <Box component="main">
      {/* ── Hero ── */}
      <Box
        sx={{
          minHeight: { xs: 700, md: 860 },
          display: "flex",
          alignItems: "flex-end",
          position: "relative",
          bgcolor: "common.black",
          color: "common.white",
          overflow: "hidden",
        }}
      >
        {heroBackdrop && (
          <Box
            key={hero?.id}
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
              animation: "heroFadeIn 0.7s ease",
              "@keyframes heroFadeIn": {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
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
                  onClick={() => guardedToggle(hero)}
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
            {heroMovies.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                {heroMovies.map((m, i) => (
                  <Box
                    key={m.id}
                    aria-label={`Show ${m.title}`}
                    component="button"
                    onClick={() => goToSlide(i)}
                    sx={{
                      width: i === heroIndex ? 28 : 8,
                      height: 8,
                      borderRadius: 4,
                      border: "none",
                      cursor: "pointer",
                      p: 0,
                      bgcolor:
                        i === heroIndex
                          ? "primary.main"
                          : alpha("#ffffff", 0.4),
                      transition: "width 0.3s ease, background-color 0.3s ease",
                      "&:hover": {
                        bgcolor:
                          i === heroIndex
                            ? "primary.main"
                            : alpha("#ffffff", 0.7),
                      },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      {/* ── Movie rows ── */}
      <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 6 } }}>
        <MovieRow
          title="Trending Movies"
          movies={trending}
          loading={!trending.length}
          onSeeMore={() => navigate("/movies?category=trending")}
        />
        <MovieRow
          title="New Releases"
          movies={nowPlaying.movies}
          loading={nowPlaying.loading}
          onSeeMore={() => navigate("/movies?category=now_playing")}
        />
        <MovieRow
          title="Top Rated"
          movies={topRated.movies}
          loading={topRated.loading}
          onSeeMore={() => navigate("/movies?category=top_rated")}
        />
        <MovieRow
          title="Popular Now"
          movies={popular.movies}
          loading={popular.loading}
          onSeeMore={() => navigate("/movies?category=popular")}
        />
      </Container>

      <PosterFan movies={trending} />

      {/* ── Stats banner ── */}
      <Box ref={statsRef} sx={{ bgcolor: "background.paper", py: { xs: 7, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack alignItems="center" spacing={{ xs: 6, md: 8 }}>
            <Stack alignItems="center" spacing={0.5}>
              <Typography
                sx={{
                  fontFamily: '"Courier New", monospace',
                  fontWeight: 700,
                  fontSize: { xs: "1.4rem", md: "2rem" },
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "text.primary",
                }}
              >
                JOIN NOW
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Courier New", monospace',
                  fontWeight: 700,
                  fontSize: { xs: "1.4rem", md: "2rem" },
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "text.primary",
                }}
              >
                GET STARTED
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                gap: { xs: 5, md: 4 },
                width: "100%",
                textAlign: "center",
              }}
            >
              {STATS.map((stat) => (
                <StatNumber key={stat.label} {...stat} active={statsActive} />
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ── Newsletter ── */}
      <Box
        sx={{
          bgcolor: "background.paper",
          background: (theme) =>
            `linear-gradient(125deg, ${alpha(theme.palette.primary.main, 0.07)}, transparent 48%)`,
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="sm">
          <Stack alignItems="center" spacing={3} textAlign="center">
            <Stack spacing={1}>
              <Typography color="text.primary" variant="h4">
                Stay in the Loop
              </Typography>
              <Typography color="text.secondary">
                Get the latest trending picks and film news delivered to your inbox.
              </Typography>
            </Stack>

            {subscribed ? (
              <Stack alignItems="center" direction="row" spacing={1}>
                <CheckCircleOutlineRounded color="primary" />
                <Typography color="primary" fontWeight={600}>
                  You're subscribed — thanks!
                </Typography>
              </Stack>
            ) : (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  inputProps={{ "aria-label": "Email address" }}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="small"
                  type="email"
                  value={email}
                />
                <Button
                  disabled={!email.includes("@")}
                  onClick={() => setSubscribed(true)}
                  sx={{ whiteSpace: "nowrap", px: 3 }}
                  variant="contained"
                >
                  Subscribe
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
