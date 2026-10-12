import { useCallback, useEffect, useState } from "react"
import { Box, Container, Stack, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { getMovieDetails, normalizeApiError } from "../api/tmdb"
import type { AppError, MovieDetailsResponse } from "../api/types"
import CastList from "../components/CastList"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "../components/Loader"
import MovieDetails from "../components/MovieDetails"
import TrailerPlayer from "../components/TrailerPlayer"

/** Fetches and composes the full movie profile route. */
export default function MovieDetailsPage() {
  const { id } = useParams()
  const movieId = Number(id)
  const [movie, setMovie] = useState<MovieDetailsResponse | null>(null)
  const [error, setError] = useState<AppError | null>(null)
  const [loading, setLoading] = useState(true)
  const [retryKey, setRetryKey] = useState(0)

  const retry = useCallback(() => setRetryKey((current) => current + 1), [])

  useEffect(() => {
    if (!Number.isInteger(movieId) || movieId <= 0) {
      setError({ message: "That movie link is not valid.", status: 404 })
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)
    getMovieDetails(movieId, controller.signal)
      .then(setMovie)
      .catch((reason) => {
        if (!controller.signal.aborted) {
          setError(normalizeApiError(reason))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [movieId, retryKey])

  if (loading) {
    return (
      <Box component="main">
        <Loader />
      </Box>
    )
  }

  if (error || !movie) {
    return (
      <Container component="main" maxWidth="md" sx={{ py: 10 }}>
        <ErrorMessage
          message={error?.message || "We couldn't find that movie."}
          onRetry={error?.status === 404 ? undefined : retry}
        />
      </Container>
    )
  }

  return (
    <Box component="main">
      <MovieDetails movie={movie} />
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 9 } }}>
        <Stack spacing={{ xs: 7, md: 10 }}>
          <Box component="section">
            <Typography
              color="primary"
              fontWeight={800}
              letterSpacing="0.12em"
              variant="overline"
            >
              THE PEOPLE
            </Typography>
            <Typography component="h2" sx={{ mb: 3 }} variant="h3">
              Top cast
            </Typography>
            <CastList cast={movie.credits?.cast ?? []} />
          </Box>
          <Box component="section">
            <Typography
              color="primary"
              fontWeight={800}
              letterSpacing="0.12em"
              variant="overline"
            >
              WATCH
            </Typography>
            <Typography component="h2" sx={{ mb: 3 }} variant="h3">
              Official trailer
            </Typography>
            <TrailerPlayer videos={movie.videos?.results ?? []} />
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
