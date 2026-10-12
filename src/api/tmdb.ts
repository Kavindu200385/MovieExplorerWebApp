import axios, { AxiosError } from "axios"
import type {
  AppError,
  Genre,
  MovieDetailsResponse,
  MovieFilters,
  MovieSummary,
  PaginatedMovieResponse,
} from "./types"

const API_KEY = import.meta.env.VITE_TMDB_KEY
const API_BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

const tmdb = axios.create({
  baseURL: API_BASE_URL,
  params: {
    language: "en-US",
  },
})

tmdb.interceptors.request.use((config) => {
  if (!API_KEY) {
    return Promise.reject(
      new Error(
        "TMDb is not configured. Add REACT_APP_TMDB_KEY to the app environment and reload.",
      ),
    )
  }

  config.params = { ...config.params, api_key: API_KEY }
  return config
})

/** Converts API and network failures into copy that can be safely shown to users. */
export function normalizeApiError(error: unknown): AppError {
  if (axios.isCancel(error)) {
    return { message: "The request was cancelled." }
  }

  if (error instanceof AxiosError) {
    if (!error.response) {
      return {
        message: "We couldn't reach TMDb. Check your connection and try again.",
      }
    }

    return {
      message:
        error.response.status === 404
          ? "We couldn't find that movie."
          : "TMDb couldn't complete the request. Please try again.",
      status: error.response.status,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: "Something unexpected happened. Please try again." }
}

/** Builds a TMDb image URL while preserving null for placeholder rendering. */
export function getImageUrl(
  path: string | null | undefined,
  size: "w185" | "w500" | "w780" | "original" = "w500",
) {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null
}

/** Loads the weekly movie trend used by the hero and default home grid. */
export async function getTrendingMovies(signal?: AbortSignal) {
  const { data } = await tmdb.get<PaginatedMovieResponse>(
    "/trending/movie/week",
    { signal },
  )
  return data.results
}

/** Loads available movie genres for the discovery controls. */
export async function getGenres(signal?: AbortSignal) {
  const { data } = await tmdb.get<{ genres: Genre[] }>("/genre/movie/list", {
    signal,
  })
  return data.genres
}

/** Searches movies by title with TMDb pagination. */
export async function searchMovies(
  query: string,
  page: number,
  signal?: AbortSignal,
) {
  const { data } = await tmdb.get<PaginatedMovieResponse>("/search/movie", {
    params: { query, page, include_adult: false },
    signal,
  })
  return data
}

/** Discovers movies from the active genre, year, and rating filters. */
export async function discoverMovies(
  filters: MovieFilters,
  page: number,
  signal?: AbortSignal,
) {
  const { data } = await tmdb.get<PaginatedMovieResponse>("/discover/movie", {
    params: {
      page,
      include_adult: false,
      sort_by: "popularity.desc",
      with_genres: filters.genre || undefined,
      primary_release_year: filters.year || undefined,
      "vote_average.gte": filters.rating || undefined,
      "vote_count.gte": filters.rating ? 50 : undefined,
    },
    signal,
  })
  return data
}

/** Loads movies currently in theatres. */
export async function getNowPlayingMovies(
  page = 1,
  signal?: AbortSignal,
) {
  const { data } = await tmdb.get<PaginatedMovieResponse>(
    "/movie/now_playing",
    { params: { page }, signal },
  )
  return data
}

/** Loads movies sorted by overall rating. */
export async function getTopRatedMovies(
  page = 1,
  signal?: AbortSignal,
) {
  const { data } = await tmdb.get<PaginatedMovieResponse>(
    "/movie/top_rated",
    { params: { page }, signal },
  )
  return data
}

/** Loads movies sorted by current popularity. */
export async function getPopularMovies(
  page = 1,
  signal?: AbortSignal,
) {
  const { data } = await tmdb.get<PaginatedMovieResponse>(
    "/movie/popular",
    { params: { page }, signal },
  )
  return data
}

/** Loads a movie and its credits and videos in one request. */
export async function getMovieDetails(id: number, signal?: AbortSignal) {
  const { data } = await tmdb.get<MovieDetailsResponse>(`/movie/${id}`, {
    params: { append_to_response: "credits,videos,reviews" },
    signal,
  })
  return data
}

/** Converts full details into the stable summary persisted as a favorite. */
export function toMovieSummary(movie: MovieDetailsResponse): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    genre_ids: movie.genres.map((genre) => genre.id),
  }
}
