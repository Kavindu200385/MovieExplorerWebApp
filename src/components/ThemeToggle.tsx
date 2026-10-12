import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { useMovieTheme } from "../context/ThemeContext"

/** Toggles and labels the persisted application color mode. */
export default function ThemeToggle() {
  const { mode, toggleTheme } = useMovieTheme()
  const nextMode = mode === "dark" ? "light" : "dark"

  return (
    <Tooltip title={`Switch to ${nextMode} mode`}>
      <IconButton
        aria-label={`Switch to ${nextMode} mode`}
        color="inherit"
        onClick={toggleTheme}
      >
        {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  )
}
