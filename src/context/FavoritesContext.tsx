import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import type { MovieSummary } from "../api/types"
import { useAuth } from "./AuthContext"
import useLocalStorage from "../hooks/useLocalStorage"

interface FavoritesContextValue {
  favorites: MovieSummary[]
  isFavorite: (id: number) => boolean
  addFavorite: (movie: MovieSummary) => void
  removeFavorite: (id: number) => void
  toggleFavorite: (movie: MovieSummary) => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
)

/** Owns a duplicate-safe persisted collection of favorite movie summaries. */
export default function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useLocalStorage<MovieSummary[]>(
    "movie-explorer-favorites",
    [],
  )

  const isFavorite = useCallback(
    (id: number) => favorites.some((movie) => movie.id === id),
    [favorites],
  )

  const removeFavorite = useCallback(
    (id: number) => {
      setFavorites((current) => current.filter((movie) => movie.id !== id))
    },
    [setFavorites],
  )

  const addFavorite = useCallback(
    (movie: MovieSummary) => {
      setFavorites((current) =>
        current.some((item) => item.id === movie.id)
          ? current
          : [...current, movie],
      )
    },
    [setFavorites],
  )

  const toggleFavorite = useCallback(
    (movie: MovieSummary) => {
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id)
      } else {
        addFavorite(movie)
      }
    },
    [addFavorite, isFavorite, removeFavorite],
  )

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [addFavorite, favorites, isFavorite, removeFavorite, toggleFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider")
  }
  return context
}

/** Like toggleFavorite but redirects to /login when the user is not authenticated. */
export function useAuthFavorite() {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const guardedToggle = useCallback(
    (movie: MovieSummary) => {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: { pathname: location.pathname } } })
        return
      }
      toggleFavorite(movie)
    },
    [isAuthenticated, location.pathname, navigate, toggleFavorite],
  )

  return { guardedToggle, isFavorite }
}
