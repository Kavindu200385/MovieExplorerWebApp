import type { PaletteMode } from "@mui/material"
import { alpha, createTheme } from "@mui/material/styles"

export const movieRed = "#e50914"

/** Creates the cinematic MUI theme shared by both persisted color modes. */
export default function createMovieTheme(mode: PaletteMode) {
  const isDark = mode === "dark"

  return createTheme({
    palette: {
      mode,
      primary: {
        main: movieRed,
        contrastText: "#ffffff",
      },
      secondary: {
        main: isDark ? "#87c8ff" : "#1769aa",
      },
      background: {
        default: isDark ? "#070708" : "#f5f2ee",
        paper: isDark ? "#121215" : "#ffffff",
      },
      text: {
        primary: isDark ? "#f7f7f7" : "#171719",
        secondary: isDark ? "#a4a4ac" : "#65636a",
      },
      divider: isDark ? "rgba(255,255,255,0.10)" : "rgba(16,16,18,0.10)",
      error: {
        main: "#ef5350",
      },
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        letterSpacing: "-0.025em",
      },
      h2: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        letterSpacing: "-0.018em",
      },
      h3: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        letterSpacing: "-0.015em",
      },
      h4: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        letterSpacing: "-0.012em",
      },
      button: {
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 700,
        letterSpacing: "0.005em",
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 180ms ease, color 180ms ease",
          },
          "::selection": {
            backgroundColor: "rgba(229,9,20,0.55)",
            color: "#ffffff",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 7,
            minHeight: 42,
            paddingInline: 20,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition:
              "background-color 160ms ease, color 160ms ease, transform 160ms ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.045)"
              : "rgba(255,255,255,0.78)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 650,
          },
        },
      },
    },
  })
}
