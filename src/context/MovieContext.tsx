import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react"
import {
  discoverMovies,
  getGenres,
  getTrendingMovies,
  normalizeApiError,
  searchMovies,
} from "../api/tmdb"
import type { AppError, Genre, MovieFilters, MovieSummary } from "../api/types"
import useDebounce from "../hooks/useDebounce"
import useLocalStorage from "../hooks/useLocalStorage"

const EMPTY_FILTERS: MovieFilters = { genre: "", year: "", rating: "" }
type ResultsMode = "idle" | "search" | "discover"

interface MovieContextValue {
  trending: MovieSummary[]
  genres: Genre[]
  results: MovieSummary[]
  query: string
  filters: MovieFilters
  mode: ResultsMode
  page: number
  totalPages: number
  isLoading: boolean
  isAppending: boolean
  error: AppError | null
  setSearchQuery: (query: string) => void
  setFilters: (filters: MovieFilters) => void
  resetFilters: () => void
  loadMore: () => void
  retry: () => void
}

const MovieContext = createContext<MovieContextValue | undefined>(undefined)

function hasFilters(filters: MovieFilters) {
  return Boolean(filters.genre || filters.year || filters.rating)
}

function mergeUnique(current: MovieSummary[], incoming: MovieSummary[]) {
  const movies = new Map(current.map((movie) => [movie.id, movie]))
  incoming.forEach((movie) => movies.set(movie.id, movie))
  return Array.from(movies.values())
}

/** Coordinates trending content, debounced search, filters, and pagination. */
export default function MovieProvider({ children }: PropsWithChildren) {
  const [trending, setTrending] = useState<MovieSummary[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [results, setResults] = useState<MovieSummary[]>([])
  const [query, setQuery] = useLocalStorage("movie-explorer-query", "")
  const [filters, setFilterState] = useState<MovieFilters>(EMPTY_FILTERS)
  const [mode, setMode] = useState<ResultsMode>("idle")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAppending, setIsAppending] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const requestId = useRef(0)
  const debouncedQuery = useDebounce(query.trim(), 400)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      getTrendingMovies(controller.signal),
      getGenres(controller.signal),
    ])
      .then(([movies, genreList]) => {
        setTrending(movies)
        setGenres(genreList)
        if (!debouncedQuery && !hasFilters(filters)) {
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((reason) => {
        if (!controller.signal.aborted) {
          setError(normalizeApiError(reason))
          setIsLoading(false)
        }
      })
    return () => controller.abort()
    // Retrying intentionally refetches both home resources.
  }, [retryKey])

  const fetchResults = useCallback(
    async (
      nextMode: Exclude<ResultsMode, "idle">,
      nextPage: number,
      append: boolean,
    ) => {
      const currentRequest = ++requestId.current
      append ? setIsAppending(true) : setIsLoading(true)
      if (!append) {
        setError(null)
      }

      try {
        const response =
          nextMode === "search"
            ? await searchMovies(debouncedQuery, nextPage)
            : await discoverMovies(filters, nextPage)

        if (currentRequest !== requestId.current) {
          return
        }
        setResults((current) =>
          append ? mergeUnique(current, response.results) : response.results,
        )
        setPage(response.page)
        setTotalPages(Math.min(response.total_pages, 500))
        setError(null)
      } catch (reason) {
        if (currentRequest === requestId.current) {
          setError(normalizeApiError(reason))
        }
      } finally {
        if (currentRequest === requestId.current) {
          setIsLoading(false)
          setIsAppending(false)
        }
      }
    },
    [debouncedQuery, filters],
  )

  useEffect(() => {
    if (debouncedQuery) {
      setMode("search")
      void fetchResults("search", 1, false)
      return
    }

    if (hasFilters(filters)) {
      setMode("discover")
      void fetchResults("discover", 1, false)
      return
    }

    requestId.current += 1
    setMode("idle")
    setResults([])
    setPage(0)
    setTotalPages(0)
    setError(null)
    setIsLoading(false)
  }, [debouncedQuery, fetchResults, filters])

  const setSearchQuery = useCallback(
    (nextQuery: string) => {
      if (nextQuery.trim()) {
        setFilterState(EMPTY_FILTERS)
      }
      setQuery(nextQuery)
    },
    [setQuery],
  )

  const setFilters = useCallback(
    (nextFilters: MovieFilters) => {
      setQuery("")
      setFilterState(nextFilters)
    },
    [setQuery],
  )

  const resetFilters = useCallback(() => setFilterState(EMPTY_FILTERS), [])

  const loadMore = useCallback(() => {
    if (mode === "idle" || isLoading || isAppending || page >= totalPages) {
      return
    }
    void fetchResults(mode, page + 1, true)
  }, [fetchResults, isAppending, isLoading, mode, page, totalPages])

  const retry = useCallback(() => {
    if (mode === "idle") {
      setIsLoading(true)
      setRetryKey((current) => current + 1)
    } else {
      void fetchResults(mode, Math.max(page, 1), page > 1)
    }
  }, [fetchResults, mode, page])

  const value = useMemo<MovieContextValue>(
    () => ({
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
    }),
    [
      error,
      filters,
      genres,
      isAppending,
      isLoading,
      loadMore,
      mode,
      page,
      query,
      resetFilters,
      results,
      retry,
      setFilters,
      setSearchQuery,
      totalPages,
      trending,
    ],
  )

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
}

export function useMovies() {
  const context = useContext(MovieContext)
  if (!context) {
    throw new Error("useMovies must be used within MovieProvider")
  }
  return context
}
