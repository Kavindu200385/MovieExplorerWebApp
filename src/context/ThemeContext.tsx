import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react"
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material"
import type { PaletteMode } from "@mui/material"
import useLocalStorage from "../hooks/useLocalStorage"
import createMovieTheme from "../theme/theme"

interface ThemeContextValue {
  mode: PaletteMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const systemDefault: PaletteMode =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

/** Provides the persisted color mode and generated cinematic MUI theme. */
export default function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useLocalStorage<PaletteMode>(
    "movie-explorer-theme",
    systemDefault,
  )
  const theme = useMemo(() => createMovieTheme(mode), [mode])
  const value = useMemo(
    () => ({
      mode,
      toggleTheme: () =>
        setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode, setMode],
  )

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useMovieTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useMovieTheme must be used within ThemeProvider")
  }
  return context
}
