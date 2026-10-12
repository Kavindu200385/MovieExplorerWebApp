import { ArrowForwardIosRounded, ChevronRightRounded } from "@mui/icons-material"
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useRef } from "react"
import type { MovieSummary } from "../api/types"
import MovieCard from "./MovieCard"

const CARD_WIDTH = 160
const SCROLL_AMOUNT = CARD_WIDTH * 4 + 48

interface MovieRowProps {
  title: string
  movies: MovieSummary[]
  loading?: boolean
  onSeeMore: () => void
}

/** Horizontal poster strip for a single movie category with scroll and "See more" controls. */
export default function MovieRow({
  title,
  movies,
  loading = false,
  onSeeMore,
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" })
  }

  return (
    <Box sx={{ mb: { xs: 4, md: 5 } }}>
      {/* Row header */}
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography
          component="h2"
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          {title}
        </Typography>
        <Stack alignItems="center" direction="row" spacing={0.5}>
          <Button
            endIcon={<ArrowForwardIosRounded sx={{ fontSize: "0.75rem !important" }} />}
            onClick={onSeeMore}
            size="small"
            sx={{ color: "primary.main", fontWeight: 700, fontSize: "0.78rem" }}
            variant="text"
          >
            See more
          </Button>
          <Tooltip title="Scroll right">
            <IconButton
              onClick={scrollRight}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: "primary.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.22) },
              }}
            >
              <ChevronRightRounded />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Scrollable card strip */}
      <Box sx={{ position: "relative" }}>
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            pb: 1,
            /* hide scrollbar */
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    flexShrink: 0,
                    width: CARD_WIDTH,
                    scrollSnapAlign: "start",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    sx={{ aspectRatio: "2/3", borderRadius: 0.5 }}
                  />
                  <Skeleton sx={{ mt: 1 }} />
                  <Skeleton width="60%" />
                </Box>
              ))
            : movies.map((movie) => (
                <Box
                  key={movie.id}
                  sx={{
                    flexShrink: 0,
                    width: { xs: CARD_WIDTH, sm: 180 },
                    scrollSnapAlign: "start",
                  }}
                >
                  <MovieCard movie={movie} />
                </Box>
              ))}
        </Box>
        {/* Right fade gradient hint */}
        <Box
          aria-hidden
          sx={{
            pointerEvents: "none",
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 60,
            background: (theme) =>
              `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
          }}
        />
      </Box>
    </Box>
  )
}
